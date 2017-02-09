import { Request, Response, NextFunction } from 'express';
import ExpressValidator = require('express-validator');
import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';

import { Mongo } from '../../../utils/mongo-monk';
import { configuration } from '../../../config';
import { userService } from '../user/service';
import { hashPassword, generateSalt } from '../../../utils/hash';

import * as _ from 'lodash';

const collectionsConfig = configuration.collections as any;
const appConfig = configuration.app as any;


interface IAuthService {
    login (username: string, password: string): Promise<any>;
    register (req: Request, user: any): Promise<any>;
    validate (req: Request): Promise<ExpressValidator.Result>;
    authenticate (req: Request, res: Response, next: NextFunction);
};

class AuthService implements IAuthService {
    async authenticate (req: Request, res: Response, next: NextFunction) {
        passport.authenticate('local', function(err, user, info) {
            const token = req.body.token || req.query.token || req.headers['x-access-token'];
            if (token) {
                // verifies secret and checks exp
                jwt.verify(token, appConfig.tokenSecret, (err, decoded) => {
                    if (err) {
                        return res.status(401).json(err); // { errorMessage: 'Not Authorized' }
                    } else {
                        // if everything is good, save to request for use in other routes
                        return userService.findOne(null, decoded)
                            .then((user)  => {
                                res.locals.user = user;
                                return next();
                            })
                            .catch((error) => {
                                return res.status(401).json(error); // { errorMessage: 'No user' }
                            });
                    }
                });
            } else {
                res.locals.user = undefined;
                return res.status(401).json({ errorMessage: 'No token' });
            }
        })(req, res, next);
    }

    // argon2
    async login (username: string, password: string): Promise<any> {
        try {
            // const user = await db.findOne({ username });
            const user = await userService.findOne(username, null, '-password');
            if (!user) {
                return Promise.reject({ statusCode: 404, errorMessage: 'Invalid username and/or password.' });
            }
            const savedSalt = user.salt.buffer;
            const passord = user.password;
            delete user.salt;
            delete user.password;

            const hash = hashPassword(password, savedSalt);
            const token = jwt.sign({ id: user._id }, appConfig.tokenSecret, {
                    expiresIn: '1m' // expires in 24 hours
                });
            return Promise.resolve({ user, token });

        } catch (error) {
            return Promise.reject(error);
        }
    }

    async register (req: Request): Promise<any> {
        try {
            const user = Object.assign({}, req.body);
            const errors = await this.validate(req);
            if (errors.array().length > 0) {
                return new Promise((resolve, reject) => {
                    return reject(errors.array());
                });
            }

            // check if user exists
            const userFromDb = await userService.findOne(user.username);
            if (userFromDb) {
                throw new Error('User already exists');
            }

            const salt = generateSalt();
            const hash = hashPassword(user.password, salt);

            user.password = hash;
            user.salt = salt;
            user.created = new Date();

            const writeResult = await userService.save(user);
            // user.id = user._id.toString();
            if (writeResult.writeError) {
                throw new Error(writeResult.writeError.errmsg);
            }
            return new Promise((resolve) => {
                const token = jwt.sign({ id: user._id }, appConfig.tokenSecret, {
                    expiresIn: '1m' // expires in 24 hours
                });
                return resolve({ token });
            });
        } catch (error) {
            return new Promise((resolve, reject) => {
                return reject(error);
            });
        }
    }

    async validate (req: Request): Promise<ExpressValidator.Result> {
        req.assert('username', 'Valid email required')
            .notEmpty().withMessage('Введите username')
            .isEmail();
        req.assert('password', 'Введите пароль').notEmpty();
        return req.getValidationResult();
    }
};

const authService = new AuthService();

export { authService };

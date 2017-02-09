"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const jwt = require("jsonwebtoken");
const passport = require("passport");
const config_1 = require("../../../config");
const service_1 = require("../user/service");
const hash_1 = require("../../../utils/hash");
const collectionsConfig = config_1.configuration.collections;
const appConfig = config_1.configuration.app;
;
class AuthService {
    authenticate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            passport.authenticate('local', function (err, user, info) {
                const token = req.body.token || req.query.token || req.headers['x-access-token'];
                if (token) {
                    jwt.verify(token, appConfig.tokenSecret, (err, decoded) => {
                        if (err) {
                            return res.status(401).json(err);
                        }
                        else {
                            return service_1.userService.findOne(null, decoded)
                                .then((user) => {
                                res.locals.user = user;
                                return next();
                            })
                                .catch((error) => {
                                return res.status(401).json(error);
                            });
                        }
                    });
                }
                else {
                    res.locals.user = undefined;
                    return res.status(401).json({ errorMessage: 'No token' });
                }
            })(req, res, next);
        });
    }
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield service_1.userService.findOne(username, null, '-password');
                if (!user) {
                    return Promise.reject({ statusCode: 404, errorMessage: 'Invalid username and/or password.' });
                }
                const savedSalt = user.salt.buffer;
                const passord = user.password;
                delete user.salt;
                delete user.password;
                const hash = hash_1.hashPassword(password, savedSalt);
                const token = jwt.sign({ id: user._id }, appConfig.tokenSecret, {
                    expiresIn: '1m'
                });
                return Promise.resolve({ user, token });
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    register(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = Object.assign({}, req.body);
                const errors = yield this.validate(req);
                if (errors.array().length > 0) {
                    return new Promise((resolve, reject) => {
                        return reject(errors.array());
                    });
                }
                const userFromDb = yield service_1.userService.findOne(user.username);
                if (userFromDb) {
                    throw new Error('User already exists');
                }
                const salt = hash_1.generateSalt();
                const hash = hash_1.hashPassword(user.password, salt);
                user.password = hash;
                user.salt = salt;
                user.created = new Date();
                const writeResult = yield service_1.userService.save(user);
                if (writeResult.writeError) {
                    throw new Error(writeResult.writeError.errmsg);
                }
                return new Promise((resolve) => {
                    const token = jwt.sign({ id: user._id }, appConfig.tokenSecret, {
                        expiresIn: '1m'
                    });
                    return resolve({ token });
                });
            }
            catch (error) {
                return new Promise((resolve, reject) => {
                    return reject(error);
                });
            }
        });
    }
    validate(req) {
        return __awaiter(this, void 0, void 0, function* () {
            req.assert('username', 'Valid email required')
                .notEmpty().withMessage('Введите username')
                .isEmail();
            req.assert('password', 'Введите пароль').notEmpty();
            return req.getValidationResult();
        });
    }
}
;
const authService = new AuthService();
exports.authService = authService;
//# sourceMappingURL=service.js.map
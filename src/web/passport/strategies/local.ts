import { Request } from 'express';
import { Strategy } from 'passport-local';
import { configuration } from '../../../config';
import { userService } from '../../api/user/service';
import * as jwt from 'jsonwebtoken';

import { hashPassword } from '../../../utils/hash';

const appConfig = configuration.app as any;

const passport = configuration.passport;

// crypto
const localStrategy = new Strategy({
        passReqToCallback: true
    }, (req: Request, username: string, password: string, done: any) => {
        userService.findOne(username)
            .then((user) => {
                const savedSalt = user.salt.buffer;
                const hash = hashPassword(password, savedSalt);
                const passord = user.password;
                delete user.salt;
                delete user.password;
                if (hash === user.password) {
                    const token = jwt.sign({ id: user._id }, appConfig.tokenSecret, {
                        expiresIn: '1m'
                    });
                    return done(null, token, user);
                } else {
                    return done(null, false, { message: 'Incorrect username and/or password' });
                }
            })
            .catch((error) => {
                return done(null, false, { message: 'Incorrect username and/or password' });
            });
});

export { localStrategy };

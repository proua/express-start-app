import { Request } from 'express';
import { Strategy } from 'passport-local';
import { configuration } from '../../../config';
import { userService } from '../../api/user/service';
import * as jwt from 'jsonwebtoken';

// import * as argon2 from 'argon2';
import { hashPassword } from '../../../utils/hash';

const appConfig = configuration.app as any;

const passport = configuration.passport;

// crypto
const localStrategy = new Strategy({
        // usernameField: 'email',
        // passwordField: 'password',
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
                        expiresIn: '1m' // expires in 24 hours
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

// // argon 2
// const localStrategy = new Strategy({
//         // usernameField: 'email',
//         // passwordField: 'password',
//         passReqToCallback: true
//     }, (req: Request, username: string, password: string, done: any) => {
//         userService.findOne(username, null, '-password -salt')
//             .then((user) => {
//                 const savedSalt = user.salt.buffer;
//                 const hash = argon2.hash(password, savedSalt)
//                     .then((hash) => {
//                         argon2.verify(hash, password)
//                             .then((match) => {
//                                 if (match) {
//                                     const token = jwt.sign({ id: user._id }, appConfig.tokenSecret, {
//                                         expiresIn: '1m' // expires in 24 hours
//                                     });
//                                     return done(null, token, user);
//                                 } else {
//                                     return done(null, false, { message: 'Incorrect username and/or password' });
//                                 }
//                             })
//                             .catch((err) => {
//                                 return done(null, false, { message: 'Incorrect username and/or password' });
//                             });
//                     });
//             })
//             .catch((error) => {
//                 return done(null, false, { message: 'Incorrect username and/or password' });
//             });
// });

export { localStrategy };

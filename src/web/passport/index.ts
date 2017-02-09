import { userService } from '../api/user/service';

import { localStrategy } from './strategies/local';

import * as passport from 'passport';

class Passport {
    constructor (passport: passport.Passport) {
        passport.use('local', localStrategy);
    }
}

export { Passport };

// const UserModel = require('../../app/server/models/user.model');
// const User = new UserModel();

// const facebook = require('./strategies/facebook');
// const google = require('./strategies/google');
// const github = require('./strategies/github');

// const co = require('co');

// const serialize = (user, done) => {
//     done(null, user._id);
// };

// const deserialize = (id, done) => {
//     const cb = co.wrap(function* () {
//         const user = User.findOne({ _id: id });
//         return yield user;
//     });
//     cb(true).then((user) => {
//         done(null, user);
//     });
// };

// module.exports = (passport) => {
//     passport.serializeUser(serialize);
//     passport.deserializeUser(deserialize);

//     passport.use(facebook);
//     passport.use(google);
//     passport.use(github);
// };
import { userService } from '../api/user/service';

import { localStrategy } from './strategies/local';

import * as passport from 'passport';

class Passport {
    constructor (passport: passport.Passport) {
        passport.use('local', localStrategy);
    }
}

export { Passport };

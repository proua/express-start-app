import { Router } from 'express';
import { controller } from './controller';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import { authService } from '../auth/service';

import { configuration } from '../../../config';
const appConfig = configuration.app as any;

class UserRouter {
    public router: Router;

    constructor () {
        this.router = Router();
        this.router.post('/register', controller.register);
        this.router.post('/login', controller.login);
    }

    // private static auth (req, res, next) {
    //     passport.authenticate('local', function(err, user, info) {
    //         if (err) {
    //             return next(err);
    //         }
    //         if (!user) {
    //             return res.status(401).json({ status: 'error', code: 'unauthorized' });
    //         } else {
    //             const token = jwt.sign({ id: user._id }, appConfig.tokenSecret, {
    //                 expiresIn: 1440 // expires in 24 hours
    //             });
    //             return res.json({ token });
    //         }
    //     })(req, res, next);
    // }
}

const router = (new UserRouter()).router;

export { router };
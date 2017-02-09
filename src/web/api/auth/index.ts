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
}

const router = (new UserRouter()).router;

export { router };

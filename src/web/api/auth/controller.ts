import { Request, Response } from 'express';

import { authService } from './service';
import { respondWithResult } from '../../../utils/respondWithResult';
import { handleError } from '../../../utils/handleError';

interface IAuthController {
    register (req: Request, res: Response);
    login (req: Request, res: Response): void;
}

class AuthController implements IAuthController {
    async register (req: Request, res: Response) {
        try {
            const result = await authService.register(req);
            respondWithResult(res)(result);
        } catch (error) {
            handleError(res, 400)(error);
        }
    }

    async login (req: Request, res: Response) {
        try {
            const result = await authService
                .login(req.body.username, req.body.password);
            respondWithResult(res)(result);
        } catch (error) {
            handleError(res, 400)(error);
        }
        // authService
        //     .login(req.body.username, req.body.password)
        //     .then(respondWithResult)
        //     .catch(handleError);
    }
}

const controller = new AuthController();

export { controller };

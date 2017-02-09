import { Request, Response } from 'express';

import { userService } from './service';
import { respondWithResult } from '../../../utils/respondWithResult';
import { handleError } from '../../../utils/handleError';

interface IUserController {
    update (req: Request, res: Response): void;
    findOne (req: Request, res: Response): void;
}

class UserController implements IUserController {
    update (req: Request, res: Response): void {
        userService
            .update(req.body)
            .then(respondWithResult)
            .catch(handleError);
    }

    findOne (req: Request, res: Response): void {
        userService
            .findOne(req.params.username, req.params.id)
            .then(respondWithResult)
            .catch(handleError);
    }
}

const controller = new UserController();

export { controller };

import { Router } from 'express';
import { controller } from './controller';

class UserRouter {
    public router: Router;

    constructor () {
        this.router = Router();
        this.router.put('/update', controller.update);
        this.router.get('/:username', controller.findOne);
        this.router.get('/id/:id', controller.findOne);
    }
}

const router = (new UserRouter()).router;

export { router };
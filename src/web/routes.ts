import * as path from 'path';
import { Application, Router, Request, Response, NextFunction, static as statucRoute } from 'express';

import { router as userRouter } from './api/user';
import { router as authRouter } from './api/auth';
// const regexps = require('./api/regexps');

class Routes {
    private app: Application;

    constructor (app: Application) {
        this.app = app;
        this.init();
    }

    private init (): void {
        this.app.use('/api/users', userRouter);
        this.app.use('/api/auth', authRouter);

        this.app.route('/:url(api|auth|components|app|bower_components|assets)/*')
        .get((req: Request, res: Response) => {
            const statusCode = 404;
            const result = {
                status: statusCode
            };

            res.status(result.status).json({ statusCode: statusCode });
        });

        this.app.route('/*')
            .get((req: Request, res: Response) => {
                res.sendFile(path.resolve('client/index.html'));
            });

        // TODO: from internet
        if (this.app.get('env') === 'production') {

            // in production mode run application from dist folder
            this.app.use(statucRoute(path.join(__dirname, '../client')));
        }

        // catch 404 and forward to error handler
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            let err = new Error('Not Found');
            next(err);
        });

        // production error handler
        // no stacktrace leaked to user
        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            res.status(err.status || 500);
            res.json({
                error: {},
                message: err.message
            });
        });
    }
}

export { Routes };

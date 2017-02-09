import { Response } from 'express';

const respondWithResult = (res: Response, statusCode?: number) => {
    const stCode = statusCode || 200;
    return (data: any): Response => {
        if (data) {
            return res.status(stCode).json(data);
        }
        return res.status(404).json({ statusCode: 404 });
    };
};

export { respondWithResult };

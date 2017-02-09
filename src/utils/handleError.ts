import { Response } from 'express';

const handleError = (res: Response, statusCode?: number): Function => {
    let stCode = statusCode || 500;
    return (error: Error | any): Response => {
        if (error instanceof Error) {
            return res.status(stCode).json({ message: error.message });
        } else {
            stCode = stCode || error.statusCode;
            return res.status(stCode).json(error);
        }
    };
};

export { handleError };

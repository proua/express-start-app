import ExpressValidator = require('express-validator');
import * as jwt from 'jsonwebtoken';

interface IUser {
    validate (): boolean;
}

class User {
    username: string;
    password: string;
    salt: string;
    created: Date;
    private hash: string;
    private isHashValid: boolean;
    constructor (user: any) {
        this.username = user.username;
        this.password = user.password;
        this.salt = user.salt;
        this.created = user.created;
        this.init();
    }

    async init () {
        this.hash = await this.hashPassword();
        this.isHashValid = this.checkPassword();
    }

    validate (): boolean {
        return true;
    }

    private async hashPassword (): Promise<any> {
        return '';
    }

    private checkPassword (): boolean {
        return true;
    }
}

export { User };

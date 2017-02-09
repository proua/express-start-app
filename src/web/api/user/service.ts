import { Request } from 'express';
import ExpressValidator = require('express-validator');
import * as jwt from 'jsonwebtoken';

import { Mongo } from '../../../utils/mongo-monk';
import { configuration } from '../../../config';

import { User } from './model';
import * as _ from 'lodash';

const collectionsConfig = configuration.collections as any;
const appConfig = configuration.app as any;
const db = (new Mongo()).getCollection(collectionsConfig.users.name);

interface IUserService {
    findOne (username?: string, id?: string, options?: Object | string | Array<any>): Promise<any>;
    update (user: any): Promise<any>;
    save (user: any): Promise<any>;
};

class UserService implements IUserService {
    findOne (username?: string, id?: string, options?: Object | string | Array<any>): Promise<any> {
        return db.findOne( username ? { username } : { _id: id }, options);
    }

    update (user: any): Promise<any> {
        return db.findOneAndUpdate({ _id: user.id }, user);
    }

    save (user: any): Promise<any> {
        return db.insert(user);
    }
};

const userService = new UserService();

export { userService };

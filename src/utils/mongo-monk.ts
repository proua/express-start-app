import * as monk from 'monk';
import { configuration } from '../config';
import * as chalk from 'chalk';

const dbConfig = configuration.db as any;

const getUrl = (): string => {
    // /mongodb://admin:123456@localhost:27017/test
    let mongoUrl = '';
    if (dbConfig.user && dbConfig.pass) {
        mongoUrl =
            `${dbConfig.protocol}://${dbConfig.user}:${dbConfig.pass}@${dbConfig.host}:${dbConfig.port}/${dbConfig.db}`;
    } else {
        mongoUrl =
            `${dbConfig.protocol}://${dbConfig.host}:${dbConfig.port}/${dbConfig.db}`;
    }
    console.log(chalk.green(mongoUrl));
    return mongoUrl;
};

let mongoUrl;
let db;

class Mongo {
    constructor () {
        mongoUrl = getUrl();
        db = monk(mongoUrl);
    }

    getCollection (collection: string) {
        return db.get(collection);
    }
}

export { Mongo };

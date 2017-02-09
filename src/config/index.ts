import * as config from 'config';

const db = config.get('db');
const app = config.get('app');
const collections = config.get('collections');
const passport = config.get('passport');

const configuration = {
    app,
    db,
    collections,
    passport
};

export { configuration };

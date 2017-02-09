import * as crypto from 'crypto';

const hashPassword = (password: string, salt: Buffer) => {
    return crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('base64');
};

const generateSalt = (): Buffer => {
    return new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
};

export { hashPassword, generateSalt };

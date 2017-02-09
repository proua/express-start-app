require('any-promise/register/bluebird');

import { app } from './app';
import * as debug from 'debug';
import * as http from 'http';
import { configuration } from '../config';
import * as chalk from 'chalk';

// -or- Equivalent to above, but allows customization of Promise library
// require('any-promise/register')('bluebird', { Promise: require('bluebird') });

const appConfig = configuration.app as any;

debug('demo:server');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || appConfig.port);
app.set('port', port);
console.log(process.env);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

server.listen(port, () => {
    console.log(chalk.green(`Express server listening on ${appConfig.port}, in ${process.env.NODE_ENV} mode`));
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val: number | string): number | string | boolean {
    let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) {
        return val;
    } else if (port >= 0) {
        return port;
    }
    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError (error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? `Pipe ${port}`
        : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
    case 'EACCES':
        console.error(chalk.red(`${bind} requires elevated privileges`));
        process.exit(1);
        break;
    case 'EADDRINUSE':
        console.error(chalk.red(`${bind} is already in use`));
        process.exit(1);
        break;
    default:
        throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening (): void {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? `pipe ${addr}`
        : `port ${addr}`;
    debug(`Listening on ${bind}`);
}

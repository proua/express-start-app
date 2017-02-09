import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as methodOverride from 'method-override';
import * as passport from 'passport';
import expressValidator = require('express-validator');
import { Routes } from './routes';

import * as ejwt from 'express-jwt';
import * as jwt from 'jsonwebtoken';

import { Passport } from './passport';

const lusca = require('lusca');

import { configuration } from '../config';

const appConfig = configuration.app as any;

class App {
    public express: express.Application;

    constructor () {
        this.express = express();
        this.express.disable('x-powered-by');
        this.middleware();
        this.security();
        this.routes();
    }

    private middleware (): void {
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(bodyParser.json());
        this.express.use(expressValidator());
        this.express.use(cookieParser());
        this.express.use(methodOverride());

        // this.express.use(session({
        //     secret: appConfig.sessionKey,
        //     cookie: {
        //         path: '/',
        //         httpOnly: true,
        //         secure: false,
        //         maxAge: null
        //     },
        //     resave: false,
        //     saveUninitialized: true
        // }));
        this.express.use(passport.initialize());
        new Passport(passport);

        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(bodyParser.json());
        this.express.use(cookieParser());
        this.express.use(methodOverride());
    }

    private security (): void {
        // security
        // this.express.use(lusca.csrf());
        this.express.use(lusca.csp( { policy: { 'default-src': '*' } } ));
        this.express.use(lusca.xframe('SAMEORIGIN'));
        this.express.use(lusca.p3p('ABCDEF'));
        this.express.use(lusca.hsts({ maxAge: 31536000, includeSubDomains: true }));
        this.express.use(lusca.xssProtection(true));
        this.express.use(lusca.nosniff());
    }

    private routes (): void {
        new Routes(this.express);
    }
}

const app = new App().express;

export  { app };

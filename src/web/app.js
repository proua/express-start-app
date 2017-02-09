"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const passport = require("passport");
const expressValidator = require("express-validator");
const routes_1 = require("./routes");
const passport_1 = require("./passport");
const lusca = require('lusca');
const config_1 = require("../config");
const appConfig = config_1.configuration.app;
class App {
    constructor() {
        this.express = express();
        this.express.disable('x-powered-by');
        this.middleware();
        this.security();
        this.routes();
    }
    middleware() {
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(bodyParser.json());
        this.express.use(expressValidator());
        this.express.use(cookieParser());
        this.express.use(methodOverride());
        this.express.use(passport.initialize());
        new passport_1.Passport(passport);
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(bodyParser.json());
        this.express.use(cookieParser());
        this.express.use(methodOverride());
    }
    security() {
        this.express.use(lusca.csp({ policy: { 'default-src': '*' } }));
        this.express.use(lusca.xframe('SAMEORIGIN'));
        this.express.use(lusca.p3p('ABCDEF'));
        this.express.use(lusca.hsts({ maxAge: 31536000, includeSubDomains: true }));
        this.express.use(lusca.xssProtection(true));
        this.express.use(lusca.nosniff());
    }
    routes() {
        new routes_1.Routes(this.express);
    }
}
const app = new App().express;
exports.app = app;
//# sourceMappingURL=app.js.map
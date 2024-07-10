import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import sessions from 'express-session';
import helmet from 'helmet';
import compression from 'compression';
import bodyParser from 'body-parser';
import swaggerUI from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import router from './router';
import { setup as setupDatabase } from './database';
import * as helpers from './helpers';
import {homeHandler} from './sessionHandlers/home';
import {loginHandler} from './sessionHandlers/login';
import { processLogin } from './sessionHandlers/process-login';
import { logout } from './sessionHandlers/logout';

const port = process.env.PORT || process.env.NODE_PORT || 4000;

const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve(__dirname, './api-autogen-spec.json'), 'utf-8'));

declare module "express-session" {
    interface SessionData {
        userId: number;
    }
}

// set up database before connecting server
setupDatabase().then(() => {
    const app = express();

    // default headers
    // Content-Security-Policy etc.
    app.use(helmet());
    app.use(compression());
    app.use(compression());

    // force incoming requests to match Content-Type
    // as well as in json format
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // set content security policy
    app.use(helpers.setCSP);
    app.use(helpers.errorHandler);

    // session setup
    app.use(
        sessions({
            secret: 'secret',
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 //24 hours
            },
            resave: true,
            saveUninitialized: false
        })
    );

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.get('/', homeHandler);
    app.get('/login', loginHandler);
    app.post('/process-login', processLogin);
    app.get('/logout', logout);

    // host swagger OAS spec file
    app.use('/help', helpers.swaggerCSP, swaggerUI.serve, swaggerUI.setup(swaggerDocument));

    router(app);

    // start the server

    app.listen(port, () => console.log(`Listening to port ${port}`));
});

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import bodyParser from 'body-parser';
import router from './router';
import { setup as setupDatabase } from './database';
import * as helpers from './helpers';

const port = process.env.PORT || process.env.NODE_PORT || 3000;

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

    // we could probably use sessions to secure user logins

    router(app);

    // start the server

    app.listen(port, () => console.log(`Listening to port ${port}`));
});

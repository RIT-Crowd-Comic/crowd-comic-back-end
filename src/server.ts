import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import bodyParser from 'body-parser';
import swaggerUI from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import router from './router';
import { setup as setupDatabase } from './database';
import * as helpers from './helpers';
import { setupS3 } from './s3Init';

const port = process.env.PORT || process.env.NODE_PORT || 4000;

const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve(__dirname, './api-autogen-spec.json'), 'utf-8'));

// set up database before connecting server
setupDatabase().then(async () => {
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
    app.use(helpers.setHeaders);

    // session setup
    app.use(helpers.validateSessionPost);

    // host swagger OAS spec file
    app.use('/help', helpers.swaggerCSP, swaggerUI.serve, swaggerUI.setup(swaggerDocument));

    router(app);

    await setupS3();

    // error handling 
    app.use(helpers.errorHandler);

    // start the server
    app.listen(port, () => console.log(`Listening to port ${port}`));
});

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
import { setup as setupDatabase, sequelize } from './database';
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
    app.use(helpers.setCSP);

    // session setup
    app.use(helpers.validateSessionPost);

    // error handling 
    app.use(helpers.errorHandler);

    // host swagger OAS spec file
    app.use('/help', helpers.swaggerCSP, swaggerUI.serve, swaggerUI.setup(swaggerDocument));

    router(app);

    await setupS3();

    // start the server
    app.listen(port, () => console.log(`Listening to port ${port}`));

    if (process.platform === 'win32') {
        /* eslint-disable @typescript-eslint/no-var-requires*/
        const rl = require('readline').createInterface({
            input:  process.stdin,
            output: process.stdout
        });

        rl.on('SIGINT', function () {
            process.emit('SIGINT');
        });
    }

    process.on('SIGINT', function () {

        // graceful shutdown
        process.exit();
    });
    process.on('exit', function() {

        // sync the table columns, create any tables that don't exist
        if (process.env.WIPE_DATA) {
            sequelize.sync({ force: true });
        }
    });

});

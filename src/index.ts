import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import bodyParser from 'body-parser';
import router from './router';

const port = process.env.PORT || process.env.NODE_PORT || 3000;

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

// we could probably use sessions to secure user logins

router(app);

// start the server

app.listen(port, () => console.log(`Listening to port ${port}`));

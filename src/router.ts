import { Express } from 'express';
import help from './services/helpService';

/**
 * Route all incoming requests
 */

export default (app: Express) => {
    app.get('/', help);
};

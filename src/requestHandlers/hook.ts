import { Request, Response } from 'express';
import * as hookService from '../services/hookService';
import { genericErrorResponse } from './helpers';


interface ResponseObject {
    success: boolean,
    body?: any
    message?: string,
    error?: string,
    status?: number,
}
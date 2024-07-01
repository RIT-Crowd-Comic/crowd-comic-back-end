import * as imageService from "../S3/services";
import { sanitizeResponse, assertArguments } from "./utils";
import { Request, Response } from 'express';
import crypto from 'crypto'

/**
 * saves an image in s3
 * @param id The id of the panel
 * @returns response or genericErrorResponse
 */
const _saveImageController = async (id : string, buffer: Buffer, mimetype: string) => {
    try {
        return await imageService.saveImage(id, buffer, mimetype);
    }
    catch (err) {
        return err as Error;
    }
};

// save an image request
const saveImage = async (req: Request , res: Response): Promise<Response> => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const id = crypto.randomUUID();

    const response = await _saveImageController(id, req.file.buffer, req.file.mimetype);
    return sanitizeResponse(response, res);
};

/**
 * saves an image in s3
 * @param id The id of the panel
 * @returns response or genericErrorResponse
 */
const _getImageController = async (id : string) => {
    try {
        return await imageService.getImage(id);
    }
    catch (err) {
        return err as Error;
    }
};

// save an image request
const getImage = async (req: Request , res: Response): Promise<Response> => {
    const id = (typeof req.query.id === 'string') ? req.query.id : '';
    const validArgs = assertArguments(
        { id },
        arg => arg !== '',
        'must be typeof string'
    );
    const response = await _getImageController(id);
    return sanitizeResponse(response, res);
};

export {saveImage};
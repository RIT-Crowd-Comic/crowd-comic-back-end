import * as imageService from "../S3/services";
import { sanitizeResponse, assertArguments, assertArgumentsDefined } from "./utils";
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
        return err;
    }
};

// save an image request
const saveImage = async (req: Request , res: Response): Promise<Response> => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    //validate that file has valid information
    const mimetype = typeof req.file.mimetype === 'string' ? req.file.mimetype : '';
    const isValidMimetype = mimetype.includes('image');

    if (!isValidMimetype) {
        return res.status(400).json({ error: 'Uploaded file must be an image' });
    }

    const buffer = req.file.buffer;
    const id = crypto.randomUUID();

    const response = await _saveImageController(id, buffer, mimetype);
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
        return err;
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
    if (!validArgs.success) return res.status(400).json(validArgs);
    const response = await _getImageController(id);
    return sanitizeResponse(response, res);
};

export {saveImage, getImage};
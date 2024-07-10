import * as imageService from '../services/imageService';
import { sanitizeResponse, assertArgumentsString } from './utils';
import { Request, Response } from 'express';
import crypto from 'crypto';

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
const saveImage = async (req: Request, res: Response): Promise<Response> => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!validateImageFile(req.file)) {
        return res.status(400).json({ error: 'Uploaded file must be an image' });
    }
    const mimetype = req.file.mimetype;
    const buffer = req.file.buffer;
    const id = crypto.randomUUID(); // generate uuid here for now

    const response = await _saveImageController(id, buffer, mimetype);
    return sanitizeResponse(response, res);

    // API documentation
    /*
    #swagger.tags = ['image']

    #swagger.consumes = ['multipart/form-data']

    #swagger.parameters['image'] = {
        in: 'formData',
        type: 'file',
        required: true,
        description: 'The file of the image to save.'
    }
    #swagger.responses[200] = {
        schema: { "id": 'image-id' }
    }
    #swagger.responses[400] = {
        schema: { $ref: '#/definitions/error' }
    }
    #swagger.responses[500] = {}
*/
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
const getImage = async (req: Request, res: Response): Promise<Response> => {
    const id = (typeof req.params.id === 'string') ? req.params.id : '';
    const validArgs = assertArgumentsString({ id });
    if (!validArgs.success) return res.status(400).json(validArgs);
    const response = await _getImageController(id);
    return sanitizeResponse(response, res);

    // API documentation
    /*  
        #swagger.tags = ['image']
        #swagger.responses[200] = {
            description: 'Returns the link to the image',
            schema: { url: 'link-to-image' }
        }
        #swagger.responses[400] = {
            schema: { $ref: '#/definitions/error' }
        }
        #swagger.responses[500] = {}
    */
};

const validateImageFile = (file: Express.Multer.File | null): boolean => {
    if (!file) return false;
    const mimetype = typeof file.mimetype === 'string' ? file.mimetype : '';
    return mimetype.includes('image');
};

export {
    saveImage, getImage, _saveImageController, _getImageController, validateImageFile
};

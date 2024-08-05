import * as imageService from '../services/imageService';

import { sanitizeResponse, assertArgumentsString, assertArgumentsNumber } from './utils';
import { Request, Response } from 'express';
import { sequelize } from '../database';
import { IPanel } from '../models';

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
    const id = req.body.id;

    const validArgs = assertArgumentsString(id);
    if (!validArgs.success) return res.status(400).json(validArgs);

    const response = await _saveImageController(id, buffer, mimetype);
    return sanitizeResponse(response, res);

    // API documentation
    /*
    #swagger.tags = ['image']
    #swagger.summary = 'Save a single image'
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['image'] = {
        in: 'formData',
        type: 'file',
        required: true,
        description: 'The file of the image to save.'
    }
    #swagger.parameters['id'] = {
        in: 'formData',
        type: 'string',
        required: true,
        description: 'The id of the image to save.'
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
const _getImageControllerSigned = async (id : string) => {
    try {
        return await imageService.getImageSigned(id);
    }
    catch (err) {
        if (err instanceof Error)
            return new Error(`S3 Error: ${err.message}`);
    }
};

// save an image request
const getImageSigned = async (req: Request, res: Response): Promise<Response> => {
    const id = (typeof req.params.id === 'string') ? req.params.id : '';
    const validArgs = assertArgumentsString({ id });
    if (!validArgs.success) return res.status(400).json(validArgs);
    const response = await _getImageControllerSigned(id);
    return sanitizeResponse(response, res);

    // API documentation
    /*  
        #swagger.tags = ['image']
        #swagger.summary = 'Get an image by its id'
        #swagger.parameters['id'] = {
            type: 'string',
            description: 'the id of the image'
        }
        #swagger.responses[200] = {
            description: 'Returns the link to the image',
            schema: { url: 'link/to/image' }
        }
        #swagger.responses[400] = {
            schema: { $ref: '#/definitions/error' }
        }
        #swagger.responses[500] = {}
    */
};

const _getAllImageUrlsByPanelSetIdController = async (id: number) => {
    try {
        const panels = await imageService.getAllImagesByPanelSetId(sequelize)(id) as IPanel[];

        if (panels == null) throw new Error(`Invalid panel id: ${id}`);

        return panels.map((panel) => ({ url: panel.image }));
    }
    catch (error) {
        return error;
    }
};


// save an image request
const getAllImageUrlsByPanelSetId = async (req: Request, res: Response): Promise<Response> => {
    const id = req.params.id;
    const validArgs = assertArgumentsNumber({ id });
    if (!validArgs.success) return res.status(400).json(validArgs);
    const response = await _getAllImageUrlsByPanelSetIdController(Number(id));
    return sanitizeResponse(response, res, `A panel set with an id of ${id} does not exist`);

    // API documentation
    /*
        #swagger.tags = ['image']
        #swagger.summary = 'Get all images from a panel set'
        #swagger.parameters['id'] = {
            type: 'number',
            description: 'the id of the panel set'
        }
        #swagger.responses[200] = {
            description: 'Returns array of all image urls',
            schema: [{ url: 'link/to/image' }]
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

const _deleteImageController = (id: string) => {
    try {
        return imageService.deleteImage(id);
    }
    catch (error) {
        return error;
    }
};

export {
    getAllImageUrlsByPanelSetId, _getAllImageUrlsByPanelSetIdController, getImageSigned, saveImage, _saveImageController, _getImageControllerSigned, validateImageFile, _deleteImageController
};

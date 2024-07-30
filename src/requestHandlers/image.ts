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
            type: 'string'
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
            type: 'number'
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


export {
    getAllImageUrlsByPanelSetId, _getAllImageUrlsByPanelSetIdController, getImageSigned, _saveImageController, _getImageControllerSigned, validateImageFile
};

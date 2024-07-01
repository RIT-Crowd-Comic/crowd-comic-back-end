import * as imageService from "../S3/queries";

interface MulterRequest extends Request {
    file: any;
}

/**
 * saves an image in s3
 * @param id The id of the panel
 * @returns response or genericErrorResponse
 */
const _saveImageController = async (name : string, buffer: Buffer, mimetype: string) => {
    try {
        return await imageService.saveImage(name, buffer, mimetype);
    }
    catch (err) {
        return err as Error;
    }
};

// save an image request
const saveImage = async (req: MulterRequest , res: any): Promise<Response> => {

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const response = await _saveImageController(req.file.originalName, req.file.buffer, req.file.mimetype);
    return res.status(200).json(response);
};

export {saveImage};
import { saveImage } from "../S3/queries";

/**
 * saves an image in s3
 * @param id The id of the panel
 * @returns response or genericErrorResponse
 */
const _saveImageController () => async (imageData) => {
    try {
        return await saveImage()
    }
    catch (err) {
        return err;
    }
};

// the actual request for getting a panel
const getPanel = async (req: Request, res: Response): Promise<Response> => {

    const response = await _saveImageController(id);
    return response;
};
import { Request, Response } from 'express';
import { Sequelize } from 'sequelize';
import { assertArguments, assertArgumentsDefined, assertArgumentsNumber, sanitizeResponse } from './utils';
import { sequelize } from '../database';
import { _createPanelSetController } from './panelSet';
import { Json } from 'sequelize/types/utils';
import { _saveImageController, validateImageFile } from './image';
import { _createPanelController } from './panel';

//types 
type hookArray = Array<{position : Json, panel_index : number}>;

interface PanelSet {
    author_id: string;
    id: number;
}
const _publishController = (sequelize : Sequelize) => async (author_id: string, 
    panelImage1 : Express.Multer.File, panelImage2 : Express.Multer.File, panelImage3: Express.Multer.File,
    image1Id: string, image2Id: string, image3Id: string, hooks : hookArray
) => {
    //make transaction
    const t = await sequelize.transaction();
    try {
        //make panel_set
        const panel_set = await _createPanelSetController(sequelize, t)(author_id);

        //validate panel set creation, if error, throw it
        if(panel_set instanceof PanelSet) throw (panel_set);

        //make panels
        const panel1 = await _createPanelController(sequelize, t)(image1Id, panel_set.id)
        
        //validate creation

        

        //save to amazon

    }
    catch (err) {
        return err;
    }
};

/**
 * Validates author_id before sending a creation request to the database
 * @param request 
 * @param res 
 * @returns 
 */
const publish = async (request: Request, res: Response) : Promise<Response> => {

    //get the author data
    const author_id = request.body.author_id;
    
    //validate
    let validArgs = assertArgumentsDefined({ author_id });
    if (!validArgs.success) return res.status(400).json(validArgs);

    //get image files
    const files = request.files as  { [fieldname: string]: Express.Multer.File[] };
    
    //check if not there
    if (!files) {
        return res.status(400).json({ message: 'No files uploaded' });
    }

    //get specific image data
    const panelImage1 = files['image1'] ? files['image1'][0] : null;
    const panelImage2 = files['image2'] ? files['image2'][0] : null;
    const panelImage3 = files['image3'] ? files['image3'][0] : null;


    //make sure all three exist
    if (!panelImage1 || !panelImage2 || !panelImage3) {
        return res.status(400).json({ message: 'All three files must be uploaded' });
    }

    // Validate all three images
    if (!validateImageFile(panelImage1)) {
        return res.status(400).json({ error: 'Uploaded file 1 must be an image' });
    }
    if (!validateImageFile(panelImage2)) {
        return res.status(400).json({ error: 'Uploaded file 2 must be an image' });
    }
    if (!validateImageFile(panelImage3)) {
        return res.status(400).json({ error: 'Uploaded file 3 must be an image' });
    }

    //generate ids for each panel image
    const image1Id = `${author_id}_${panelImage1.originalname}_${Date.now()}`;
    const image2Id = `${author_id}_${panelImage2.originalname}_${Date.now()}`;
    const image3Id = `${author_id}_${panelImage3.originalname}_${Date.now()}`;

    //get the hooks data
    const hooks = request.body.hooks as hookArray;

    //validate
    for(let i = 0; i < hooks.length; i++){
        validArgs = assertArgumentsDefined({position : hooks[i].position});
        if (!validArgs.success) return res.status(400).json(validArgs);
        validArgs = assertArgumentsNumber({index: hooks[i].panel_index})
        if (!validArgs.success) return res.status(400).json(validArgs);
    }

    //call the controller
    
   // return sanitizeResponse(response, res);
};


export {
    _publishController, publish
};

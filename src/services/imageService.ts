import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { endpoint, s3 } from '../s3Init';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Sequelize } from 'sequelize';

import dotenv from 'dotenv';
dotenv.config();

const saveImage = async(id : string, buffer: Buffer, mimetype : string)=>{

    const params = {
        Bucket:      process.env.BUCKET_NAME,
        Key:         id,
        Body:        buffer,
        ContentType: mimetype
    };
    const saveImage = new PutObjectCommand(params);

    await s3.send(saveImage);

    return { id: id }; // return id to show valid save
};

const getImageSigned = async(id : string) =>{
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key:    id
    };

    const getImage = new GetObjectCommand(params);
    await s3.send(getImage);

    const url = await getSignedUrl(s3, getImage, { expiresIn: 86400 }); // one day

    return { url: url };
};


const getImage = (id : string) =>{
    if (endpoint)
        return `http://${endpoint}/${process.env.BUCKET_NAME}/${id}`;
    return `http://${process.env.BUCKET_NAME}.s3.amazonaws.com/${id}`;// https://your-bucket-name.s3.amazonaws.com/path/to/your/file.txt
};

const getAllImagesByPanelSetId = (sequelize: Sequelize) => async (panel_set_id: number) => {
    return sequelize.models.panel.findAll({
        where:      { panel_set_id: panel_set_id },
        attributes: ['image', 'id'],
        order:      [ ['id', 'ASC'] ]
    });
};
export {
    saveImage, getImageSigned, getAllImagesByPanelSetId, getImage
};

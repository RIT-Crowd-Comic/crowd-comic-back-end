import { PutObjectCommand } from '@aws-sdk/client-s3';
import {s3, bucketName} from './init';

interface imageData{
    originalname: string;
    buffer: Buffer;
    mimetype: string;
}

const saveImage = async(imageData : imageData)=>{

    const params = {
        Bucket: bucketName,
        Key: imageData.originalname,
        Body: imageData.buffer,
        ContentType: imageData.mimetype
    }
    const saveImage = new PutObjectCommand(params)

    await s3.send(saveImage);
}

export {saveImage};

import { PutObjectCommand } from '@aws-sdk/client-s3';
import {s3, bucketName} from './init';


const saveImage = async(name : string, buffer: Buffer, mimetype : string)=>{

    const params = {
        Bucket: bucketName,
        Key: name,
        Body: buffer,
        ContentType: mimetype
    }
    const saveImage = new PutObjectCommand(params);

    await s3.send(saveImage);

    return {status : 'success'};
}

export {saveImage};

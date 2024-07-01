import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import {s3, bucketName} from './init';
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const saveImage = async(name : string, buffer: Buffer, mimetype : string)=>{

    const params = {
        Bucket: bucketName,
        Key: name,
        Body: buffer,
        ContentType: mimetype
    }
    const saveImage = new PutObjectCommand(params);

    await s3.send(saveImage);

    return {name: name};
}

const getImage = async(id : string) =>{
    const params = {
        Bucket: bucketName,
        Key: id
    }

    const getImage = new GetObjectCommand(params);

    const url = await getSignedUrl(s3, getImage, {expiresIn: 3600});

    return {url: url};
}

export {saveImage, getImage};

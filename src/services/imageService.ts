import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { s3, bucketName } from '../s3Init';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const saveImage = async(id : string, buffer: Buffer, mimetype : string)=>{

    const params = {
        Bucket:      bucketName,
        Key:         id,
        Body:        buffer,
        ContentType: mimetype
    };
    const saveImage = new PutObjectCommand(params);

    await s3.send(saveImage);

    return { id: id };
};

const getImage = async(id : string) =>{
    const params = {
        Bucket: bucketName,
        Key:    id
    };

    const getImage = new GetObjectCommand(params);
    await s3.send(getImage);

    const url = await getSignedUrl(s3, getImage, { expiresIn: 86400 }); // one day

    return { url: url };
};

export { saveImage, getImage };

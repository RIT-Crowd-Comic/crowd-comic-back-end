import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { s3, bucketName } from '../s3Init';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Sequelize } from 'sequelize';

const saveImage = async(id : string, buffer: Buffer, mimetype : string)=>{

    const params = {
        Bucket:      bucketName,
        Key:         id,
        Body:        buffer,
        ContentType: mimetype
    };
    const saveImage = new PutObjectCommand(params);

    await s3.send(saveImage);

    return { id: id }; // return id to show valid save
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

const getAllImagessByPanelSetId = (sequelize: Sequelize) => async (panel_set_id: number) => {
    const images = sequelize.models.panel_set.findAll({
        where: {
            panel_set_id: panel_set_id 
        },
      });
      console.log(images);
}
export { saveImage, getImage };

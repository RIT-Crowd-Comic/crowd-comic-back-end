import  {PutObjectAclCommand, S3Client } from "@aws-sdk/client-s3";

import dotenv from 'dotenv'

dotenv.config();

const s3 = new S3Client({
   credentials:{
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string
   },
   region: process.env.BUCKET_REGION as string
});

const bucketName = process.env.BUCKET_NAME;

export {s3, bucketName};
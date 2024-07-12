import  { S3Client, CreateBucketCommand  } from '@aws-sdk/client-s3';

import dotenv from 'dotenv';
const S3rver = require('s3rver');

dotenv.config();

const aws = new S3rver({
    port: 5000,
    hostname: 'localhost',
    silent: false,
    directory: '/tmp/s3rver_test_directory'
});

aws.run((err : Error, hostname : string, port : number, directory : string) => {
    if (err) {
      console.error('Error starting server:', err);
    } else {
      console.log(`s3rver running at http://${hostname}:${port}, using directory: ${directory}`);
    }
});

const config = {
    forcePathStyle: true,
    credentials: {
      accessKeyId: 'S3RVER',
      secretAccessKey:  'S3RVER',
    },
    region: process.env.BUCKET_REGION as string,
    endpoint: 'http://localhost:5000'
}

const s3 = new S3Client(
    /*credentials: {
        accessKeyId:     process.env.S3_ACCESS_KEY as string,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string
    },
    region: process.env.BUCKET_REGION as string*/
    config
);

const bucketName = process.env.BUCKET_NAME;

async function createBucket() {
    try {
        const createBucketCommand = new CreateBucketCommand({ Bucket: bucketName });
        const response = await s3.send(createBucketCommand);
        console.log("Bucket created successfully:", response);
    } catch (error) {
        console.error("Error creating bucket:", error);
    }
}

createBucket();


export { s3, bucketName };

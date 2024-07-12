import  { S3Client, CreateBucketCommand  } from '@aws-sdk/client-s3';

import dotenv from 'dotenv';


import s3rver from 's3rver';
dotenv.config();

const aws = new s3rver({
    port:      5000,
    silent:    false,
    directory: '/tmp/s3rver_test_directory'
});

aws.run(() => {
    console.log('Server for aws running.');
});

const config = {
    forcePathStyle: true,
    credentials:    {
        accessKeyId:     'S3RVER',
        secretAccessKey: 'S3RVER',
    },
    region:   process.env.BUCKET_REGION as string,
    endpoint: 'http://localhost:5000'
};

/* credentials: {
    accessKeyId:     process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string
},
region: process.env.BUCKET_REGION as string*/
const s3 = new S3Client(config);
const bucketName = process.env.BUCKET_NAME;

async function createBucket() {
    try {
        const createBucketCommand = new CreateBucketCommand({ Bucket: bucketName });
        const response = await s3.send(createBucketCommand);
        console.log('Bucket created successfully:', response);
    }
    catch (error) {
        console.error('Error creating bucket:', error);
    }
}

createBucket();


export { s3, bucketName };

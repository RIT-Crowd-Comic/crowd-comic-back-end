import  { S3Client, CreateBucketCommand  } from '@aws-sdk/client-s3';

import dotenv from 'dotenv';


import s3rver from 's3rver';
dotenv.config();

try {
    const aws = new s3rver({
        port:         5000,
        silent:       true,
        directory:    '/tmp/s3rver_test_directory',
        resetOnClose: true
    });

    aws.run(() => {
        console.log('Server for aws running.');
    });
}
catch (error) { console.error('An error occurred during aws s3ver setup:', error); }

let s3 : S3Client;
let bucketName : string | undefined;
try {

    // config for fakeS3
    const config = {
        forcePathStyle: true,
        credentials:    {
            accessKeyId:     'S3RVER',
            secretAccessKey: 'S3RVER',
        },
        region:   process.env.BUCKET_REGION as string,
        endpoint: 'http://localhost:5000'
    };

    // config for actual s3
    /* const trueConfig = {
        credentials: {
            accessKeyId:     process.env.S3_ACCESS_KEY as string,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
        },
        region: process.env.BUCKET_REGION as string,
    };*/

    s3 = new S3Client(config);
    bucketName = process.env.BUCKET_NAME;
}
catch (error) {
    console.error('An error occurred s3 setup. Ensure that .env is setup properly and endpoint is correct.', error);
}


async function createBucket() {
    try {
        const createBucketCommand = new CreateBucketCommand({ Bucket: bucketName });
        const response = await s3.send(createBucketCommand);
        console.log('Bucket created successfully:', response);
    }
    catch (error) {
        console.error('S3 Error: Error creating bucket. Ensure that .env is setup properly:', error);
    }
}

createBucket();


export { s3, bucketName };

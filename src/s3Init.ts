import  { S3Client, PutBucketPolicyCommand } from '@aws-sdk/client-s3';
import path from 'path';

import dotenv from 'dotenv';


import s3rver from 's3rver';
dotenv.config();

let s3 : S3Client;
let bucketName : string | undefined;
if (process.env.NODE_ENV === 'production') {

    try {

        // config for actual s3
        const config = {
            credentials: {
                accessKeyId:     process.env.S3_ACCESS_KEY as string,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
            },
            region: process.env.BUCKET_REGION as string,
        };

        s3 = new S3Client(config);
        bucketName = process.env.BUCKET_NAME;
    }
    catch (error) {
        console.error('An error occurred s3 setup. Ensure that .env is setup properly and endpoint is correct.', error);
    }
}
else {
    try {
        const aws = new s3rver({
            port:         5000,
            silent:       true,
            directory:    path.resolve(__dirname + '/tmp/s3rver_test_directory'),
            resetOnClose: true
        });

        aws.run(() => {
            console.log('Server for aws running.');
        });
    }
    catch (error) { console.error('An error occurred during aws s3ver setup:', error); }

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

        setBucketPolicy();
    }
    catch (error) {
        console.error('An error occurred s3 setup. Ensure that .env is setup properly and endpoint is correct.', error);
    }
}



// THE FOLLOWING 4 FUNCTIONS ARE FOR TESTING ALTHOUGH THEY COULD BE USED FOR 1 TIME DB setup

async function setBucketPolicy() {
    const bucketPolicy = {
        Version:   '2012-10-17',
        Statement: [
            {
                Sid:       'PublicReadGetObject',
                Effect:    'Allow',
                Principal: '*',
                Action:    's3:GetObject',
                Resource:  `arn:aws:s3:::${bucketName}/*`
            }
        ]
    };

    const params = {
        Bucket: bucketName,
        Policy: JSON.stringify(bucketPolicy)
    };

    try {
        const putBucketPolicyCommand = new PutBucketPolicyCommand(params);
        await s3.send(putBucketPolicyCommand);
        console.log(`Bucket policy set to make bucket ${bucketName} public.`);
    }
    catch (error) {
        console.error('Error setting bucket policy:', error);
    }
}

setBucketPolicy();


export { s3, bucketName };

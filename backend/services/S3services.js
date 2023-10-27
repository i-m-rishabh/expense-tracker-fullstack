const AWS = require('aws-sdk');

async function uploadToS3(BucketName, data, fileName) {
    const s3BucketName = BucketName;
    const IAM_USER_KEY = process.env.IAM_USER_ACCESS_KEY_ID;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET_ACCESS_KEY;
    const s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        region: 'us-east-2',
    });

    const params = {
        Bucket: s3BucketName,
        Key: fileName,
        Body: data,
        ACL: 'public-read'
    };

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log('error occured');
                reject(err);
            } else {
                console.log('success');
                resolve(s3response.Location);
            }
        });
    });
}

module.exports = {
    uploadToS3,
}
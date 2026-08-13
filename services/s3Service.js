const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

// Create an Amazon S3 service client object.
// If connecting to MinIO, S3_ENDPOINT should be provided (e.g. http://127.0.0.1:9000).
// S3_REGION is required by AWS SDK v3, but for MinIO you can usually set it to 'us-east-1'.
const s3Client = new S3Client({
    region: process.env.S3_REGION || 'us-east-1',
    endpoint: process.env.S3_ENDPOINT, // e.g., 'http://minio:9000' in k8s
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
        secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin'
    },
    forcePathStyle: true // Required for MinIO
});

const DEFAULT_BUCKET = process.env.S3_BUCKET_NAME || 'kamysoft-assets';

/**
 * Uploads a file buffer directly to S3.
 * 
 * @param {Buffer} fileBuffer - The file data
 * @param {String} fileName - The desired name/path of the file in the bucket
 * @param {String} mimetype - The MIME type of the file
 * @param {Boolean} isPublic - Whether the file should be publicly readable
 * @returns {Promise<String>} - The URL or Key of the uploaded file
 */
const uploadFile = async (fileBuffer, fileName, mimetype, isPublic = false) => {
    const params = {
        Bucket: DEFAULT_BUCKET,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimetype,
    };

    // Note: To use ACL 'public-read', your bucket must have ACLs enabled.
    // Otherwise, rely on Bucket Policies to make certain paths (like /public/) public.
    if (isPublic) {
        // We add this assuming the bucket supports it. If it fails, remove it and use bucket policies.
        // params.ACL = 'public-read'; 
    }

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    if (isPublic) {
        // Construct the public URL
        const endpoint = process.env.S3_ENDPOINT || `https://${DEFAULT_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com`;
        return `${endpoint}/${DEFAULT_BUCKET}/${fileName}`;
    }

    return fileName; // Return the key for private objects
};

/**
 * Generates a pre-signed, expiring download URL for a private file.
 * 
 * @param {String} objectKey - The key (path) of the object in S3
 * @param {Number} expiresInSeconds - Time in seconds until the link expires
 * @returns {Promise<String>} - The presigned URL
 */
const getPresignedUrl = async (objectKey, expiresInSeconds = 3600) => {
    const command = new GetObjectCommand({
        Bucket: DEFAULT_BUCKET,
        Key: objectKey
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
    return url;
};

module.exports = {
    s3Client,
    uploadFile,
    getPresignedUrl,
    DEFAULT_BUCKET
};

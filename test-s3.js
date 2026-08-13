const { uploadFile, getPresignedUrl } = require('./services/s3Service');

async function runTest() {
    console.log('Testing S3 / MinIO Integration...');
    try {
        // 1. Upload a dummy text file
        const dummyContent = Buffer.from('Hello from Kubernetes!', 'utf-8');
        const fileName = `test-tenant/digital-assets/test-file-${Date.now()}.txt`;
        
        console.log(`Uploading dummy file: ${fileName}...`);
        const objectKey = await uploadFile(dummyContent, fileName, 'text/plain', false);
        console.log(`Upload successful! Object Key: ${objectKey}`);
        
        // 2. Generate a presigned URL
        console.log(`Generating presigned URL for key: ${objectKey}...`);
        const url = await getPresignedUrl(objectKey, 3600); // 1 hour expiry
        console.log(`\nPresigned URL generated successfully:\n${url}\n`);
        
        console.log('Test completed successfully. S3/MinIO is fully configured!');
    } catch (err) {
        console.error('Test failed. Error:', err.message);
        console.error(err);
    }
}

runTest();

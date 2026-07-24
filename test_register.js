const http = require('http');

const data = JSON.stringify({
    tenantId: 'teststore123',
    businessName: 'Test Store 123',
    businessType: 'retail',
    adminUsername: 'admin',
    email: 'test@example.com',
    mobile: '0500000000',
    nationalAddress: 'Test Address',
    vatNumber: '123456',
    crNumber: '123456',
    billingCycle: 'monthly',
    fullName: 'Test Admin'
});

const options = {
    hostname: 'localhost',
    port: 8089,
    path: '/api/auth/register-tenant',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
        console.log('BODY:', rawData);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();

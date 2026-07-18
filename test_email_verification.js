const http = require('http');

const postData = JSON.stringify({
  tenantId: 'test-email-v1',
  email: 'test@kamysoft.com',
  adminUsername: 'admin',
  adminPassword: 'password123',
  businessName: 'Test V1',
  businessType: 'retail'
});

const options = {
  hostname: 'localhost',
  port: 8089,
  path: '/api/auth/register-tenant',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Registration:', data);
    
    // Now try to log in
    const loginData = JSON.stringify({
      username: 'admin',
      password: 'password123'
    });
    
    const loginOptions = {
      hostname: 'localhost',
      port: 8089,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData),
        'Host': 'test-email-v1.localhost:8089'
      }
    };
    
    const loginReq = http.request(loginOptions, (loginRes) => {
      let loginBody = '';
      loginRes.on('data', (chunk) => { loginBody += chunk; });
      loginRes.on('end', () => {
        console.log('Login Status:', loginRes.statusCode);
        console.log('Login Body:', loginBody);
      });
    });
    loginReq.write(loginData);
    loginReq.end();
  });
});

req.write(postData);
req.end();

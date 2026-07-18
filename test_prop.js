const axios = require('axios');
async function test() {
    try {
        const tenantRaw = 'mypropbiz' + Date.now();
        const reg = await axios.post('http://127.0.0.1:8089/api/auth/register-tenant', {
            tenantId: tenantRaw,
            businessName: 'My Prop Biz',
            businessType: 'Retail',
            adminUsername: 'admin',
            adminPassword: 'password123',
            email: 'test@mypropbiz.com',
            mobile: '123456789',
            nationalAddress: '123 Main St',
            vatNumber: '123456789012345',
            crNumber: '1234567890',
            billingCycle: 'monthly',
            fullName: 'Test User'
        });
        const finalTenantId = reg.data.tenantId;
        console.log('Reg Data:', reg.data);
        
        const login = await axios.post('http://127.0.0.1:8089/api/auth/login', { username: 'admin', password: 'password123' }, {
            headers: { 'x-tenant-id': finalTenantId }
        });
        const token = login.data.token;
        
        const res = await axios.post('http://127.0.0.1:8089/api/properties', { name: 'Test', type: 'Resort', location: 'Test Loc' }, { headers: { Authorization: 'Bearer ' + token, 'x-tenant-id': finalTenantId } });
        console.log('Success POST Property:', res.data);
        
        const res2 = await axios.get('http://127.0.0.1:8089/api/properties', { headers: { Authorization: 'Bearer ' + token, 'x-tenant-id': finalTenantId } });
        console.log('Success GET Property:', res2.data);
        
    } catch (err) {
        console.log('Error:', err.response ? err.response.data : err.message);
    }
}
test();

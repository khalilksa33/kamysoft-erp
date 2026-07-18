const fetch = require('node:fetch');

async function testPropertyAPI() {
    try {
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'password' })
        });
        const { token } = await loginRes.json();
        if (!token) {
            console.log("Failed to login");
            return;
        }

        const postRes = await fetch('http://localhost:5000/api/properties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ name: 'Test Property', type: 'Building', location: 'Riyadh', ownerId: '' })
        });
        console.log('POST status:', postRes.status);
        console.log('POST response:', await postRes.text());
    } catch(e) {
        console.error(e.message);
    }
}
testPropertyAPI();

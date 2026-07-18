const express = require('express');
const app = express();
app.use(express.json());

global.isMongoConnected = false;
global.mockDb = { properties: [] };

app.post('/api/properties', async (req, res) => {
    try {
        const tenantId = 'test';
        const newProperty = { ...req.body, tenantId, id: 'prop-' + Date.now() };
        global.mockDb.properties.push(newProperty);
        res.status(201).json(newProperty);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

const request = require('supertest');
request(app)
  .post('/api/properties')
  .send({ name: 'Test', type: 'Resort', location: 'Test Loc', ownerId: '' })
  .expect(201)
  .end(function(err, res) {
    if (err) throw err;
    console.log(res.body);
  });

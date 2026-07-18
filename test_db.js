const mongoose = require('mongoose');
const { Property, PropertyOwner } = require('./models');

mongoose.connect('mongodb://localhost:27017/kamysoft', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('Connected to MongoDB');
    try {
        const p = await Property.create({
            id: 'prop-test123',
            name: 'Test Property',
            type: 'Resort',
            location: 'Local',
            tenantId: 'testtenant'
        });
        console.log('Property created successfully:', p);
    } catch (e) {
        console.error('Error creating property:', e);
    }
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});

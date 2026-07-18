const mongoose = require('mongoose');
const { Property } = require('./models');

mongoose.connect('mongodb://localhost:27017/kamysoft-erp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('Connected to MongoDB');
    try {
        const newProperty = {
            id: 'prop-' + Date.now(),
            tenantId: 'muddassar',
            name: 'Test Property',
            type: 'Building',
            location: 'Dubai',
            ownerId: ''
        };
        await Property.create(newProperty);
        console.log('Property created successfully');
    } catch (err) {
        console.error('Error creating property:', err.message);
    }
    process.exit(0);
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

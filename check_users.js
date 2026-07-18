const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/kamysoft_erp').then(async () => {
    const { User } = require('./models');
    const users = await User.find({});
    console.log("Users:", users.map(u => ({ username: u.username, tenantId: u.tenantId, hash: u.passwordHash })));
    process.exit(0);
});

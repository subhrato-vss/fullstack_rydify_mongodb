const mongoose = require('mongoose');
const Admin = require('../mongo_models/admin');
const connectDB = require('../mongodb.config');

const seedAdmin = async () => {
    try {
        await connectDB();
        
        const adminExists = await Admin.findOne({ email: 'admin@gmail.com' });
        
        if (!adminExists) {
            await Admin.create({
                name: 'Super Admin',
                email: 'admin@gmail.com',
                password: '123456'
            });
            console.log('✅ Admin user created successfully');
        } else {
            await Admin.findOneAndUpdate({ email: 'admin@gmail.com' }, { password: '123456' });
            console.log('✅ Admin credentials updated successfully');
        }
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding admin:', err.message);
        process.exit(1);
    }
};

seedAdmin();

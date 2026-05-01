const connectDB = require('../mongodb.config');
const MongoAdmin = require('../mongo_models/admin');
const MongoUser = require('../mongo_models/user');
const MongoDealer = require('../mongo_models/dealer');
const MongoCategory = require('../mongo_models/category');
const MongoCar = require('../mongo_models/car');
const MongoCarRequest = require('../mongo_models/car_request');
const MongoReview = require('../mongo_models/review');
const MongoBooking = require('../mongo_models/booking');
const mongoose = require('mongoose');

const verify = async () => {
    try {
        await connectDB();
        console.log('--- Verification ---');
        
        const userCount = await MongoUser.countDocuments();
        const carCount = await MongoCar.countDocuments();
        const bookingCount = await MongoBooking.countDocuments();
        
        console.log(`Users in MongoDB: ${userCount}`);
        console.log(`Cars in MongoDB: ${carCount}`);
        console.log(`Bookings in MongoDB: ${bookingCount}`);
        
        if (bookingCount > 0) {
            const booking = await MongoBooking.findOne().populate('userId carId dealerId');
            console.log('Sample Booking with Populated Data:');
            console.log(JSON.stringify(booking, null, 2));
        }

        process.exit(0);
    } catch (err) {
        console.error('Verification failed:', err);
        process.exit(1);
    }
};

verify();

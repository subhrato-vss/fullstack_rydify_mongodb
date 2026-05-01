const db = require('../db.config'); // MySQL Sequelize
const connectDB = require('../mongodb.config'); // MongoDB Mongoose function
const mongoose = require('mongoose');

// Import MongoDB Models
const MongoAdmin = require('../mongo_models/admin');
const MongoUser = require('../mongo_models/user');
const MongoDealer = require('../mongo_models/dealer');
const MongoCategory = require('../mongo_models/category');
const MongoCar = require('../mongo_models/car');
const MongoCarRequest = require('../mongo_models/car_request');
const MongoReview = require('../mongo_models/review');
const MongoBooking = require('../mongo_models/booking');

const migrate = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        console.log('--- Starting Migration ---');

        // Clear existing MongoDB collections
        console.log('Clearing existing collections...');
        await MongoAdmin.deleteMany({});
        await MongoUser.deleteMany({});
        await MongoDealer.deleteMany({});
        await MongoCategory.deleteMany({});
        await MongoCar.deleteMany({});
        await MongoCarRequest.deleteMany({});
        await MongoReview.deleteMany({});
        await MongoBooking.deleteMany({});

        // 1. Migrate Categories
        console.log('Migrating Categories...');
        const categories = await db.category.findAll();
        const categoryMap = {}; // mysql_id -> mongo_id
        for (const cat of categories) {
            const newCat = await MongoCategory.create({
                name: cat.name,
                photo: cat.photo
            });
            categoryMap[cat.id] = newCat._id;
        }
        console.log(`Migrated ${categories.length} categories.`);

        // 2. Migrate Admins
        console.log('Migrating Admins...');
        const admins = await db.admin.findAll();
        for (const admin of admins) {
            await MongoAdmin.create({
                name: admin.name,
                email: admin.email,
                password: admin.password
            });
        }
        console.log(`Migrated ${admins.length} admins.`);

        // 3. Migrate Dealers
        console.log('Migrating Dealers...');
        const dealers = await db.dealer.findAll();
        const dealerMap = {};
        for (const dealer of dealers) {
            const newDealer = await MongoDealer.create({
                name: dealer.name,
                email: dealer.email,
                password: dealer.password,
                adhar_card: dealer.adhar_card,
                pan_card: dealer.pan_card,
                mobile: dealer.mobile,
                gender: dealer.gender,
                photo: dealer.photo,
                address: dealer.address,
                city: dealer.city,
                status: dealer.status
            });
            dealerMap[dealer.id] = newDealer._id;
        }
        console.log(`Migrated ${dealers.length} dealers.`);

        // 4. Migrate Users
        console.log('Migrating Users...');
        const users = await db.user.findAll();
        const userMap = {};
        for (const user of users) {
            const newUser = await MongoUser.create({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                password: user.password,
                mobile: user.mobile,
                gender: user.gender,
                photo: user.photo,
                address: user.address,
                city: user.city,
                status: user.status
            });
            userMap[user.id] = newUser._id;
        }
        console.log(`Migrated ${users.length} users.`);

        // 5. Migrate Cars (depends on Categories, Dealers)
        console.log('Migrating Cars...');
        const cars = await db.car.findAll();
        const carMap = {};
        for (const car of cars) {
            const newCar = await MongoCar.create({
                brand: car.brand,
                model: car.model,
                name: car.name,
                fuelType: car.fuelType,
                transmissionType: car.transmissionType,
                mileage: car.mileage,
                kmDriven: car.kmDriven,
                engineCapacity: car.engineCapacity,
                chassisNumber: car.chassisNumber,
                price: car.price,
                ownerType: car.ownerType,
                accidentalHistory: car.accidentalHistory,
                address: car.address,
                contact: car.contact,
                email: car.email,
                photo: car.photo,
                dealer: dealerMap[car.dealerId],
                category: categoryMap[car.categoryId],
                status: car.status
            });
            carMap[car.id] = newCar._id;
        }
        console.log(`Migrated ${cars.length} cars.`);

        // 6. Migrate Car Requests (depends on Users, Dealers, Cars)
        console.log('Migrating Car Requests...');
        const requests = await db.car_request.findAll();
        for (const req of requests) {
            await MongoCarRequest.create({
                car: carMap[req.carId],
                dealer: dealerMap[req.dealerId],
                user: userMap[req.userId],
                status: req.status
            });
        }
        console.log(`Migrated ${requests.length} car requests.`);

        // 7. Migrate Bookings (depends on Users, Cars, Dealers)
        console.log('Migrating Bookings...');
        const bookings = await db.booking.findAll();
        for (const booking of bookings) {
            await MongoBooking.create({
                car: carMap[booking.carId],
                user: userMap[booking.userId],
                dealer: dealerMap[booking.dealerId],
                startDate: booking.startDate,
                endDate: booking.endDate,
                totalAmount: booking.totalAmount,
                paymentId: booking.paymentId,
                status: booking.status
            });
        }
        console.log(`Migrated ${bookings.length} bookings.`);

        // 8. Migrate Reviews (depends on Users, Cars)
        console.log('Migrating Reviews...');
        const reviews = await db.review.findAll();
        for (const review of reviews) {
            await MongoReview.create({
                user: userMap[review.userId],
                car: carMap[review.carId],
                rating: review.rating,
                feedback: review.feedback
            });
        }
        console.log(`Migrated ${reviews.length} reviews.`);

        console.log('--- Migration Completed Successfully ---');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();

var jwt = require('jsonwebtoken');
var secret_key = 'abcd#$%@12345678';
const emailService = require('../utils/emailService');



var userController = {};
const User = require('../mongo_models/user');
const CarRequest = require('../mongo_models/car_request');
const Car = require('../mongo_models/car');
const Review = require('../mongo_models/review');
const Booking = require('../mongo_models/booking');
const Dealer = require('../mongo_models/dealer');

userController.renderSignUpPage=(req,res)=>
{
    res.json({ success: true, message: "User signup endpoint reached. Please POST details to /register." });
}
userController.renderLoginPage=(req,res)=>
{
    res.json({ success: true, message: "User login endpoint reached. Please POST credentials to /login." });
}
//register usersPic and login usersPic
userController.registerUser = async (req, res) => {
    try {
        var {email} = req.body;
        var result = await User.find({email: email});
        if (result.length == 0) {
            var {photo} = req.files;
            var server_path = `public/usersPic/${photo.name}`;
            var db_path = `/usersPic/${photo.name}`;
            photo.mv(server_path, async (error) => {
                if (error) {
                    res.status(500).json({ success: false, message: "Failed to upload photo", error: error.message });
                } else {
                    try {
                        req.body.photo = db_path;
                        // Remove status from body to use default 'Active'
                        delete req.body.status;
                        
                        await User.create(req.body);

                        // Send Welcome Email (async)
                        emailService.sendUserWelcomeEmail(req.body);

                        res.json({ success: true, message: "User registered Successfully" });
                    } catch (e) {
                        res.status(500).json({ success: false, message: "Failed to register user", error: e.message });
                    }
                }
            });
        } else {
            res.status(400).json({ success: false, message: "User Already Exists" });
        }
    } catch (e) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
userController.loginUser = async (req, res) => {
    try {
        var {email, password} = req.body;
        var result = await User.findOne({
            email: email,
            password: password
        });
        if (result) {
            if (result.status === 'Active') {
                var payload = {
                    id: result._id,
                    email: result.email,
                    name: result.first_name,
                    first_name: result.first_name
                }
                var token = jwt.sign(payload, secret_key, {expiresIn: '1D'});
                res.cookie('UserToken', token);
                res.json({ success: true, data: { token, user: payload }, message: "Login Successful" });
            } else {
                res.status(403).json({ success: false, message: "User Blocked By Admin", error: "Forbidden" });
            }
        } else {
            res.status(401).json({ success: false, message: "Invalid Credentials", error: "Authentication Failed" });
        }
    } catch (e) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
userController.getStats = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const [totalCount, pendingCount, confirmedCount, completedCount, cancelledCount] = await Promise.all([
            Booking.countDocuments({ user: userId }),
            Booking.countDocuments({ user: userId, status: 'Pending' }),
            Booking.countDocuments({ user: userId, status: 'Confirmed' }),
            Booking.countDocuments({ user: userId, status: 'Completed' }),
            Booking.countDocuments({ user: userId, status: 'Cancelled' })
        ]);

        res.json({
            success: true,
            data: {
                total: totalCount,
                pending: pendingCount,
                confirmed: confirmedCount,
                completed: completedCount,
                cancelled: cancelledCount
            }
        });
    } catch (e) {
        res.status(500).json({ success: false, message: "Failed to fetch stats", error: e.message });
    }
}
userController.renderDashboard=(req,res)=>
{
    res.json({ success: true, data: { name: req.user.name }, message: "User Dashboard accessed successfully" });
}
userController.checkToken = (req, res) => {
    if (req.user) {
        res.json({ success: true, message: "Token is valid", data: req.user });
    } else {
        res.status(401).json({ success: false, message: "Unauthorized", error: "No token found" });
    }
}
userController.logoutUser = (req, res) => {
    res.clearCookie('UserToken');
    res.json({ success: true, message: "Logged out successfully" });
}
userController.renderProfile = (req, res) => {
    res.json({ success: true, message: "User Profile endpoint accessed successfully" });
}
userController.showProfile = async (req, res) => {
    try {
        var {id} = req.user;
        var record = await User.findById(id);
        if (record) {
            res.json({ success: true, data: record, message: "Profile fetched successfully" });
        } else {
            res.status(404).json({ success: false, message: "User profile not found", error: "Not Found" });
        }
    } catch (e) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
userController.updateProfile = async (req, res) => {
    try {
        let id = req.params.id;
        if (!id || id === 'undefined' || id === 'null') {
            id = req.user.id;
        }

        const updateData = { ...req.body };
        // Prevent accidental email/password overwrite
        delete updateData.email;
        delete updateData.password;

        if (req.files && req.files.photo) {
            const photo = req.files.photo;
            const extension = photo.name.split('.').pop();
            const fileName = `user_${id}_${Date.now()}.${extension}`;
            const server_path = `public/usersPic/${fileName}`;
            const db_path = `/usersPic/${fileName}`;

            photo.mv(server_path, async (error) => {
                if (error) {
                    console.error("File move error:", error);
                    return res.status(500).json({ success: false, message: "Failed to upload photo", error: error.message });
                }
                updateData.photo = db_path;
                try {
                    await User.findByIdAndUpdate(id, updateData);
                    return res.json({ success: true, message: "Profile Updated Successfully with Photo" });
                } catch (dbError) {
                    return res.status(500).json({ success: false, message: "Failed to update database", error: dbError.message });
                }
            });
        } else {
            try {
                await User.findByIdAndUpdate(id, updateData);
                return res.json({ success: true, message: "Profile Details Updated Successfully" });
            } catch (dbError) {
                return res.status(500).json({ success: false, message: "Failed to update profile", error: dbError.message });
            }
        }
    } catch (e) {
        console.error("Update profile error:", e);
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
userController.updateProfile2 = async (req, res) => {
    try {
        var {id} = req.params;
        await User.findByIdAndUpdate(id, req.body);
        res.json({ success: true, message: "Details Updated SuccessFully" });
    } catch (e) {
        res.status(500).json({ success: false, message: "Failed to update profile", error: e.message });
    }
}
userController.changePassword = async (req, res) => {
    res.json({ success: true, message: "Change Password endpoint accessed successfully" });
}

userController.updatePassword = async (req, res) => {
    try {
        var {id} = req.user;
        var {password, new_password} = req.body;
        var record = await User.findOne({_id: id, password: password});
        if (record) {
            await User.findByIdAndUpdate(id, {password: new_password});
            res.json({ success: true, message: "Password Updated SuccessFully" });
        } else {
            res.status(400).json({ success: false, message: "Invalid Password", error: "Bad Request" });
        }
    } catch (e) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
userController.addCarRequest=async (req,res)=>
{
    try
    {
        var {id}=req.user;
        req.body.user=id;
        await CarRequest.create(req.body);
        res.json({ success: true, message: 'Request Sent to Dealer' });
    }
    catch (e)
    {
        res.status(500).json({ success: false, message: "Failed to send request", error: e.message });
    }
}
userController.updateCarStatus=async (req,res)=>
{
    try
    {
        var {id}=req.params;
        var result=await Car.findByIdAndUpdate(id, req.body);
        if(result)
        {
            res.json({ success: true, message: "Car status updated SuccessFully" });
        }
        else
        {
            res.status(404).json({ success: false, message: "Invalid Id", error: "Not Found" });
        }
    }
    catch (e)
    {
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
userController.thankyou= (req,res)=>
{
    res.json({ success: true, message: "Thank you for your request!" });
}
userController.renderMyCarPage= (req,res)=>
{
    res.json({ success: true, message: "My Cars endpoint accessed successfully" });
}

userController.fetchMyCars = async (req, res) =>
{
    try {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const { id } = req.user;
        const count = await CarRequest.countDocuments({ user: id });
        const rows = await CarRequest.find({ user: id })
            .populate({
                path: 'car',
                select: 'brand model name mileage photo price fuelType transmissionType kmDriven ownerType engineCapacity createdAt chassisNumber accidentalHistory category'
            })
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit);
        res.json({ 
            success: true, 
            data: rows, 
            meta: {
                total: count,
                page: page,
                limit: limit,
                totalPages: Math.ceil(count / limit)
            },
            message: "My cars fetched successfully" 
        });
    } catch (e) {
        res.status(500).json({ success: false, message: "Failed to fetch cars", error: e.message });
    }
}
userController.addReview=async (req,res)=>
{
    try
    {
        req.body.user=req.user.id;
        await reviewModel.create(req.body);
        res.json({ success: true, message: "Review Added SuccessFully" });
    }
    catch (e)
    {
        res.status(500).json({ success: false, message: "Failed to add review", error: e.message });
    }
}

userController.createBooking = async (req, res) => {
    try {
        const { carId: car, dealerId: dealer, startDate, endDate, totalAmount, paymentId } = req.body;
        const user = req.user.id;

        const newBooking = await Booking.create({
            car,
            user,
            dealer,
            startDate,
            endDate,
            totalAmount,
            paymentId,
            status: 'Pending'
        });

        // Update car status to Booked (to prevent others from booking)
        await Car.findByIdAndUpdate(car, { status: 'Booked' });

        // Fetch details for email notification
        try {
            const [dealerDoc, carDoc, userDoc] = await Promise.all([
                Dealer.findById(dealer),
                Car.findById(car),
                User.findById(user)
            ]);

            if (dealerDoc && carDoc && userDoc) {
                await emailService.sendBookingConfirmationToDealer(dealerDoc.email, newBooking, carDoc, userDoc);
            }
        } catch (emailErr) {
            console.error("Failed to fetch info for booking email:", emailErr);
        }

        res.json({ success: true, message: "Booking request received! Waiting for dealer confirmation.", data: newBooking });
    } catch (e) {
        res.status(500).json({ success: false, message: "Failed to process booking", error: e.message });
    }
}

userController.fetchMyBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        const bookings = await Booking.find({ user: userId })
            .populate({
                path: 'car',
                select: 'id brand name photo price model fuelType transmissionType ownerType mileage kmDriven engineCapacity chassisNumber accidentalHistory category dealer'
            })
            .sort({ createdAt: -1 });

        // Fetch user reviews separately to avoid complex joins and map them
        const reviews = await Review.find({ user: userId });
        const dataWithReviews = bookings.map(booking => {
            const review = reviews.find(r => r.car.toString() === booking.car?._id.toString());
            return {
                ...booking.toObject(),
                userReview: review || null
            };
        });

        res.json({ success: true, data: dataWithReviews, message: "Bookings fetched successfully" });
    } catch (e) {
        res.status(500).json({ success: false, message: "Failed to fetch bookings", error: e.message });
    }
}

userController.addReview = async (req, res) => {
    try {
        const { carId: car, rating, feedback } = req.body;
        const user = req.user.id;

        if (!car || !rating || !feedback) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Use findOne + update/create to handle editing existing review
        let review = await Review.findOne({ user, car });
        let isNew = false;

        if (review) {
            review.rating = parseInt(rating);
            review.feedback = feedback;
            await review.save();
        } else {
            review = await Review.create({
                user,
                car,
                rating: parseInt(rating),
                feedback
            });
            isNew = true;
        }

        // Send email to dealer
        try {
            const carDoc = await Car.findById(car);
            const userDoc = await User.findById(user);
            const dealerDoc = await Dealer.findById(carDoc.dealer);
            if (dealerDoc && carDoc && userDoc) {
                await emailService.sendReviewNotificationToDealer(dealerDoc.email, carDoc, userDoc, review);
            }
        } catch (emailErr) {
            console.error("Failed to send review email to dealer:", emailErr);
        }

        res.json({ 
            success: true, 
            message: isNew ? "Review submitted successfully! Dealer notified." : "Review updated successfully!", 
            data: review 
        });
    } catch (e) {
        res.status(500).json({ success: false, message: "Failed to process review", error: e.message });
    }
}

module.exports = userController;
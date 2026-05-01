const jwt = require("jsonwebtoken");
const emailService = require('../utils/emailService');
const dealerController = {};
var secret_key = 'abcd#$%@12345678';

var nodemailer = require('nodemailer');

const Dealer = require('../mongo_models/dealer');
const Car = require('../mongo_models/car');
const Category = require('../mongo_models/category');
const CarRequest = require('../mongo_models/car_request');
const User = require('../mongo_models/user');
const Booking = require('../mongo_models/booking');

dealerController.RenderSignup = (req, res) => {
    res.json({ success: true, message: "Dealer signup endpoint reached. Please POST details to /register." });
}
dealerController.RenderLogin = (req, res) => {
    res.json({ success: true, message: "Dealer login endpoint reached. Please POST credentials to /login." });
}
dealerController.registerDealer = async (req, res) => {
    try {
        // Handle potential field name mismatch from frontend cache
        if (req.body.aadhaar_card && !req.body.adhar_card) {
            req.body.adhar_card = req.body.aadhaar_card;
        }

        var { email } = req.body;
        var result = await Dealer.find({ email: email });
        if (result.length == 0) {
            if (!req.files || !req.files.photo) {
                return res.status(400).json({ success: false, message: "Profile photo is required" });
            }

            var { photo } = req.files;
            var server_path = `public/dealersPic/${photo.name}`;
            var db_path = `/dealersPic/${photo.name}`;

            photo.mv(server_path, async (error) => {
                if (error) {
                    console.error("Photo upload error:", error);
                    res.status(500).json({ success: false, message: "Failed to upload photo", error: error.message });
                } else {
                    try {
                        req.body.photo = db_path;
                        // Remove status from body to use default 'Inactive'
                        delete req.body.status;

                        await Dealer.create(req.body);

                        // Send Welcome Email (async, doesn't block response)
                        emailService.sendWelcomeEmail(req.body);

                        res.json({ success: true, message: "Dealer registered Successfully" });
                    } catch (e) {
                        console.error("Database error during dealer registration:", e);
                        res.status(500).json({ success: false, message: "Failed to register dealer", error: e.message });
                    }
                }
            });
        } else {
            res.status(400).json({ success: false, message: "Dealer Already Exists" });
        }
    } catch (e) {
        console.error("Internal Server Error in registerDealer:", e);
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
dealerController.loginDealer = async (req, res) => {
    try {
        var { email, password } = req.body;
        var result = await Dealer.findOne({
            email: email,
            password: password
        });
        if (result) {
            if (result.status === 'Active') {
                var payload = {
                    id: result._id,
                    email: result.email,
                    name: result.name,
                    photo: result.photo
                }
                var token = jwt.sign(payload, secret_key, { expiresIn: '1D' });
                res.cookie('DealerToken', token);
                res.json({ success: true, data: { token, dealer: payload }, message: "Login Successful" });
            } else {
                res.status(403).json({ success: false, message: "KYC DETAILS ARE UNDER PROCESS", error: "Forbidden" });
            }
        } else {
            res.status(401).json({ success: false, message: "Invalid Credentials", error: "Authentication Failed" });
        }
    } catch (e) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
dealerController.renderDashBoard = (req, res) => {
    res.json({ success: true, message: "Dealer Dashboard accessed successfully" });
}
dealerController.getStats = async (req, res) => {
    try {
        const dealerId = req.dealer.id;
        
        const [totalCars, pendingCount, confirmedCount, completedCount, cancelledCount] = await Promise.all([
            Car.countDocuments({ dealer: dealerId }),
            Booking.countDocuments({ dealer: dealerId, status: 'Pending' }),
            Booking.countDocuments({ dealer: dealerId, status: 'Confirmed' }),
            Booking.countDocuments({ dealer: dealerId, status: 'Completed' }),
            Booking.countDocuments({ dealer: dealerId, status: 'Cancelled' })
        ]);

        res.json({
            success: true,
            data: {
                vehicles: totalCars,
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
dealerController.checkToken = (req, res) => {
    if (req.dealer) {
        res.json({ success: true, message: "Token is valid", data: req.dealer });
    } else {
        res.status(401).json({ success: false, message: "Unauthorized", error: "No token found" });
    }
}
dealerController.logoutUser = (req, res) => {
    res.clearCookie('DealerToken');
    res.json({ success: true, message: "Logged out successfully" });
}
dealerController.renderProfile = (req, res) => {
    res.json({ success: true, message: "Dealer Profile endpoint accessed successfully" });
}
dealerController.showProfile = async (req, res) => {
    try {
        var { id } = req.dealer;
        var record = await Dealer.findById(id);
        if (record) {
            res.json({ success: true, data: record, message: "Profile fetched successfully" });
        } else {
            res.status(404).json({ success: false, message: "Dealer profile not found", error: "Not Found" });
        }
    } catch (e) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
dealerController.updateProfile = async (req, res) => {
    try {
        let id = req.params.id;
        if (!id || id === 'undefined' || id === 'null') {
            id = req.dealer.id;
        }
        
        console.log("Updating profile for dealer ID:", id);
        console.log("Update Data:", req.body);

        const updateData = { ...req.body };
        // Prevent accidental email/password overwrite if not in the specific flow
        delete updateData.email; 
        delete updateData.password;

        if (req.files && req.files.photo) {
            const photo = req.files.photo;
            const extension = photo.name.split('.').pop();
            const fileName = `dealer_${id}_${Date.now()}.${extension}`;
            const server_path = `public/dealersPic/${fileName}`;
            const db_path = `/dealersPic/${fileName}`;

            photo.mv(server_path, async (error) => {
                if (error) {
                    console.error("File move error:", error);
                    return res.status(500).json({ success: false, message: "Failed to upload photo", error: error.message });
                }
                updateData.photo = db_path;
                try {
                    await Dealer.findByIdAndUpdate(id, updateData);
                    return res.json({ success: true, message: "Profile Updated Successfully with Photo" });
                } catch (dbError) {
                    console.error("DB Update error (with photo):", dbError);
                    return res.status(500).json({ success: false, message: "Failed to update database", error: dbError.message });
                }
            });
        } else {
            try {
                await Dealer.findByIdAndUpdate(id, updateData);
                return res.json({ success: true, message: "Profile Details Updated Successfully" });
            } catch (dbError) {
                console.error("DB Update error:", dbError);
                return res.status(500).json({ success: false, message: "Failed to update profile", error: dbError.message });
            }
        }
    } catch (e) {
        console.error("Update profile error:", e);
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
dealerController.updateProfile2 = async (req, res) => {
    try {
        var { id } = req.params;
        await Dealer.findByIdAndUpdate(id, req.body);
        res.json({ success: true, message: "Details Updated SuccessFully" });
    } catch (e) {
        res.status(500).json({ success: false, message: "Failed to update profile", error: e.message });
    }
}
dealerController.changePassword = async (req, res) => {
    res.json({ success: true, message: "Change Password endpoint accessed successfully" });
}

dealerController.updatePassword = async (req, res) => {
    try {
        var { id } = req.dealer;
        var { password, new_password } = req.body;
        var record = await Dealer.findOne({ _id: id, password: password });
        if (record) {
            await Dealer.findByIdAndUpdate(id, { password: new_password });
            res.json({ success: true, message: "Password Updated SuccessFully" });
        } else {
            res.status(400).json({ success: false, message: "Invalid Password", error: "Bad Request" });
        }
    } catch (e) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
dealerController.renderManageCar = async (req, res) => {
    res.json({ success: true, message: "Manage Car endpoint accessed successfully" });
}
dealerController.addCar = async (req, res) => {
    try {
        if (!req.files || !req.files.photo) {
            return res.status(400).json({ success: false, message: "Car photo is required" });
        }

        var { photo } = req.files;
        var { id } = req.dealer;
        var server_path = `public/uploads/${photo.name}`;
        var db_path = `/uploads/${photo.name}`;

        photo.mv(server_path, async (error) => {
            if (error) {
                console.error("Photo upload error:", error);
                res.status(500).json({ success: false, message: "Failed to upload photo", error: error.message });
            } else {
                try {
                    // Fetch dealer info for missing required fields (address, email)
                    const dealer = await Dealer.findById(id);
                    if (!dealer) {
                        return res.status(404).json({ success: false, message: "Dealer not found" });
                    }

                    req.body.photo = db_path;
                    req.body.dealer = id;
                    if (req.body.categoryId) {
                        req.body.category = req.body.categoryId;
                    }
                    
                    // Fallbacks for required fields if missing in body
                    if (!req.body.email) req.body.email = dealer.email;
                    if (!req.body.address) req.body.address = dealer.address || dealer.city;
                    // Contact is now allowed to be null as per user request
                    if (!req.body.contact) req.body.contact = null;

                    await Car.create(req.body);
                    res.json({ success: true, message: "Car Added Successfully" });
                }
                catch (e) {
                    console.error("Database error in addCar:", e);
                    res.status(500).json({ success: false, message: "Failed to add car", error: e.message });
                }
            }
        });
    } catch (e) {
        console.error("Internal Server Error in addCar:", e);
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
dealerController.fetchCategories = async (req, res) => {
    try {
        var records = await Category.find();
        res.json({ success: true, data: records, message: "Categories fetched successfully" });
    }
    catch (e) {
        res.status(500).json({ success: false, message: "Failed to fetch categories", error: e.message });
    }
}
dealerController.fetchcars = async (req, res) => {
    try {
        let { page = 1, limit = 10, status } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const whereClause = { dealer: req.dealer.id };
        if (status) whereClause.status = status;

        const count = await Car.countDocuments(whereClause);
        const rows = await Car.find(whereClause)
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
            message: "Cars fetched successfully"
        });
    }
    catch (e) {
        res.status(500).json({ success: false, message: "Failed to fetch cars", error: e.message });
    }
}

dealerController.updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        const dealerId = req.dealer.id;

        if (req.files && req.files.photo) {
            const { photo } = req.files;
            const server_path = `public/uploads/${photo.name}`;
            const db_path = `/uploads/${photo.name}`;

            photo.mv(server_path, async (error) => {
                if (error) {
                    return res.status(500).json({ success: false, message: "Failed to upload photo", error: error.message });
                }
                req.body.photo = db_path;
                await Car.findOneAndUpdate({ _id: id, dealer: dealerId }, req.body);
                res.json({ success: true, message: "Car updated successfully" });
            });
        } else {
            await Car.findOneAndUpdate({ _id: id, dealer: dealerId }, req.body);
            res.json({ success: true, message: "Car updated successfully" });
        }
    } catch (e) {
        res.status(500).json({ success: false, message: "Failed to update car", error: e.message });
    }
}
dealerController.deleteCar = async (req, res) => {
    try {
        var { id } = req.params;
        await Car.findByIdAndDelete(id);
        res.json({ success: true, message: "Car deleted successfully" });
    }
    catch (e) {
        res.status(500).json({ success: false, message: "Failed to delete car", error: e.message });
    }
}
dealerController.renderManageCarReq = async (req, res) => {
    res.json({ success: true, message: "Manage Car Requests endpoint accessed successfully" });
}
dealerController.fetchCarReq = async (req, res) => {
    try {
        let { page = 1, limit = 10, status = 'Pending' } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const count = await Booking.countDocuments({ dealer: req.dealer.id, status: status });
        const rows = await Booking.find({ dealer: req.dealer.id, status: status })
            .populate({
                path: 'car',
                select: 'brand model name mileage photo price status fuelType transmissionType kmDriven engineCapacity ownerType chassisNumber accidentalHistory category'
            })
            .populate({
                path: 'user',
                select: 'first_name last_name email mobile'
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
            message: "Bookings fetched successfully"
        });
    }
    catch (e) {
        res.status(500).json({ success: false, message: "Failed to fetch bookings", error: e.message });
    }
}
dealerController.UpdateCarReq = async (req, res) => {
    try {
        var { id } = req.params;
        const { status } = req.body;
        
        // Fetch the booking to get the carId
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        await Booking.findByIdAndUpdate(id, req.body);

        // If booking is cancelled or completed, make the car available again
        if (status === 'Cancelled' || status === 'Completed') {
            await Car.findByIdAndUpdate(booking.car, { status: 'Available' });
        }

        // If booking is confirmed, send email to user
        if (status === 'Confirmed') {
            try {
                const [user, car] = await Promise.all([
                    User.findById(booking.user),
                    Car.findById(booking.car)
                ]);
                if (user && car) {
                    await emailService.sendBookingConfirmationToUser(user.email, booking, car);
                }
            } catch (emailErr) {
                console.error("Failed to send confirmation email to user:", emailErr);
            }
        }

        res.json({ success: true, message: `Booking updated to ${status} successfully` });
    }
    catch (e) {
        res.status(500).json({ success: false, message: "Failed to update booking", error: e.message });
    }
}
dealerController.updateCarStatus = async (req, res) => {
    try {
        var { id } = req.params;
        var result = await Car.findByIdAndUpdate(id, req.body);
        if (result) {
            res.json({ success: true, message: "Car status updated SuccessFully" });
        }
        else {
            res.status(404).json({ success: false, message: "Invalid Id", error: "Not Found" });
        }
    }
    catch (e) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
dealerController.renderApprovedReq = (req, res) => {
    res.json({ success: true, message: "Approved Requests endpoint accessed successfully" });
}
dealerController.fetchApprovedReq = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const count = await Booking.countDocuments({ dealer: req.dealer.id, status: 'Confirmed' });
        const rows = await Booking.find({ dealer: req.dealer.id, status: 'Confirmed' })
            .populate({
                path: 'car',
                select: 'brand model name mileage photo price status fuelType transmissionType kmDriven engineCapacity ownerType chassisNumber accidentalHistory category'
            })
            .populate({
                path: 'user',
                select: 'first_name last_name email mobile'
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
            message: "Confirmed bookings fetched successfully"
        });
    }
    catch (e) {
        res.status(500).json({ success: false, message: "Failed to fetch confirmed bookings", error: e.message });
    }
}
dealerController.renderCancelledReq = (req, res) => {
    res.json({ success: true, message: "Cancelled Requests endpoint accessed successfully" });
}
dealerController.fetchCancelledReq = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const count = await Booking.countDocuments({ dealer: req.dealer.id, status: 'Cancelled' });
        const rows = await Booking.find({ dealer: req.dealer.id, status: 'Cancelled' })
            .populate({
                path: 'car',
                select: 'brand model name mileage photo price status fuelType transmissionType kmDriven engineCapacity ownerType chassisNumber accidentalHistory category'
            })
            .populate({
                path: 'user',
                select: 'first_name last_name email mobile'
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
            message: "Cancelled bookings fetched successfully"
        });
    }
    catch (e) {
        res.status(500).json({ success: false, message: "Failed to fetch cancelled bookings", error: e.message });
    }
}
dealerController.renderCompletedReq = (req, res) => {
    res.json({ success: true, message: "Completed Requests endpoint accessed successfully" });
}
dealerController.fetchCompletedReq = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const count = await Booking.countDocuments({ dealer: req.dealer.id, status: 'Completed' });
        const rows = await Booking.find({ dealer: req.dealer.id, status: 'Completed' })
            .populate({
                path: 'car',
                select: 'brand model name mileage photo price status fuelType transmissionType kmDriven engineCapacity ownerType chassisNumber accidentalHistory category'
            })
            .populate({
                path: 'user',
                select: 'first_name last_name email mobile'
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
            message: "Completed bookings fetched successfully"
        });
    }
    catch (e) {
        res.status(500).json({ success: false, message: "Failed to fetch completed bookings", error: e.message });
    }
}

dealerController.sendEmail = async (req, res) => {
    try {
        var { email, vehicle_name, status, name } = req.body;
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dummymail2003s@gmail.com',
                pass: 'uevludqlpergxtje',
            },
        });
        const mailOptions = {
            from: 'dummymail2003s@gmail.com',
            to: email,
            subject: `Subject: Your ${vehicle_name} Request Has Been ${status}`,
            html: `<h1>Dear ${name}</h1>
This is to inform you that Your Vehicle Buying Request for ${vehicle_name} at Dealaro has been ${status}...`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(500).json({ success: false, message: "Failed to send email", error: error.message });
            } else {
                res.json({ success: true, message: "E-Mail Sent Successfully" });
            }
        });
    } catch (e) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
module.exports = dealerController;
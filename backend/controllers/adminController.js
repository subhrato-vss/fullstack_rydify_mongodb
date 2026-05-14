//getting the model for inserting the data
const Admin = require('../mongo_models/admin');
const User = require('../mongo_models/user');
const Dealer = require('../mongo_models/dealer');
const Category = require('../mongo_models/category');
const CarRequest = require('../mongo_models/car_request');
const Car = require('../mongo_models/car');
const Booking = require('../mongo_models/booking');
var adminController={};
var jwt=require('jsonwebtoken');
//for email sending
var nodemailer = require('nodemailer');

var secret_key='abcd#$%@12345678';
//making function to call in admin.js route directly
//adding data too the table

adminController.renderAdminPage=(req,res)=>
{
    res.json({ success: true, message: "Admin login endpoint reached. Please POST credentials to /login." });
}
adminController.loginAdmin=async (req,res)=>
{
    try
    {
        var {email, password} = req.body;
        var result=await Admin.findOne({
            email:email,
            password:password
        });
        if(result)
        {
            var payload={
                id:result._id,
                email:result.email,
                name:result.name
            }
            var token=jwt.sign(payload,secret_key,{expiresIn:'1D'});
            res.cookie('AdminToken',token);
            res.json({ success: true, data: { token, admin: payload }, message: "Login Successful" });
        }
        else
        {
            res.status(401).json({ success: false, message: "Invalid Credentials", error: "Authentication Failed" });
        }
    }
    catch (e)
    {
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
adminController.renderDashboard=(req,res)=>
{
    res.json({ success: true, message: "Admin Dashboard accessed successfully" });
}
adminController.renderManageDealer=(req,res)=>
{
    res.json({ success: true, message: "Manage Dealer endpoint accessed successfully" });
}
adminController.fetchDealers=async (req,res)=>
{
    try
    {
        let { page = 1, limit = 10, status } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const whereClause = status ? { status } : {};

        const count = await Dealer.countDocuments(whereClause);
        const rows = await Dealer.find(whereClause)
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
            message: "Dealers fetched successfully" 
        });
    }
    catch (e)
    {
        res.status(500).json({ success: false, message: "Failed to fetch dealers", error: e.message });
    }
}
adminController.updateDealerStatus=async (req,res)=>
{
    try
    {
        var {id}=req.params;
        await Dealer.findByIdAndUpdate(id, req.body);
        res.json({ success: true, message: "Dealer status updated successfully" });
    }
    catch (e)
    {
        res.status(500).json({ success: false, message: "Failed to update dealer status", error: e.message });
    }
}
adminController.deleteDealer=async (req,res)=>
{
    try
    {
        var {id}=req.params;
        await Dealer.findByIdAndDelete(id);
        res.json({ success: true, message: "Dealer deleted successfully" });
    }
    catch (e)
    {
        res.status(500).json({ success: false, message: "Failed to delete dealer", error: e.message });
    }
}
adminController.sendEmail = async (req, res) => {
    try {
        var {email,status,name} = req.body;
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
            subject: 'Subject: Your KYC Verification Request Has Been '+status,
            html: `<h1>Dear ${name}</h1>
This is to inform you that Your KYC Verification Status For DealerShip has been ${status}...`,
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
adminController.renderManageCategory=(req,res)=>
{
    res.json({ success: true, message: "Manage Category endpoint accessed successfully" });
}
adminController.addCategory=async (req,res)=>
{
    try {
        var {name, type} = req.body;
        var result = await Category.find({name: name});
        if (result.length == 0) {
            var {photo} = req.files;
            var server_path = `public/categoryPic/${photo.name}`;
            var db_path = `/categoryPic/${photo.name}`;
            photo.mv(server_path, async (error) => {
                if (error) {
                    res.status(500).json({ success: false, message: "Failed to upload photo", error: error.message });
                }
                else {
                    try {
                        req.body.photo = db_path;
                        await Category.create(req.body);
                        res.json({ success: true, message: "Category Created Successfully" });
                    } catch (e) {
                        res.status(500).json({ success: false, message: "Failed to create category", error: e.message });
                    }
                }
            });
        } else {
            res.status(400).json({ success: false, message: "Category Already Exists" });
        }
    } catch (e) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
adminController.viewCategory=async (req,res)=>
{
    try
    {
        var records = await Category.find();
        res.json({ 
            success: true, 
            data: records, 
            meta: { total: records.length },
            message: "Categories fetched successfully" 
        });
    }
    catch (e)
    {
        res.status(500).json({ success: false, message: "Failed to fetch categories", error: e.message });
    }
}

adminController.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type } = req.body;
        
        if (req.files && req.files.photo) {
            const { photo } = req.files;
            const server_path = `public/categoryPic/${photo.name}`;
            const db_path = `/categoryPic/${photo.name}`;
            
            photo.mv(server_path, async (error) => {
                if (error) {
                    return res.status(500).json({ success: false, message: "Failed to upload photo", error: error.message });
                }
                req.body.photo = db_path;
                await Category.findByIdAndUpdate(id, req.body);
                res.json({ success: true, message: "Category updated successfully" });
            });
        } else {
            await Category.findByIdAndUpdate(id, { name, type });
            res.json({ success: true, message: "Category updated successfully" });
        }
    } catch (e) {
        res.status(500).json({ success: false, message: "Failed to update category", error: e.message });
    }
}
adminController.deleteCategory=async (req,res)=>
{
    try
    {
        var {id}=req.params;
        await Category.findByIdAndDelete(id);
        res.json({ success: true, message: "Category deleted successfully" });
    }
    catch (e)
    {
        res.status(500).json({ success: false, message: "Failed to delete category", error: e.message });
    }
}
//change password
adminController.changePassword=async (req,res)=>
{
    res.json({ success: true, message: "Change Password endpoint accessed successfully" });
}
adminController.updatePassword=async (req,res)=>
{
    try
    {
        var {id}=req.admin.id;
        var {password,new_password}=req.body;
        var record=await Admin.findOne({_id:id,password:password});
        if(record)
        {
            await Admin.findByIdAndUpdate(id, {password:new_password});
            res.json({ success: true, message: "Password Updated SuccessFully" });
        }
        else
        {
            res.status(400).json({ success: false, message: "Invalid Password" });
        }
    }
    catch (e)
    {
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
adminController.logout=(req,res)=>
{
    res.clearCookie('AdminToken');
    res.json({ success: true, message: "Logged out successfully" });
}
adminController.checkToken = (req, res) => {
    if (req.admin) {
        res.json({ success: true, message: "Token is valid", data: req.admin });
    } else {
        res.status(401).json({ success: false, message: "Unauthorized", error: "No token found" });
    }
}
adminController.renderBooking=(req,res)=>
{
    res.json({ success: true, message: "View Bookings endpoint accessed successfully" });
}
adminController.fetchBookings = async (req, res) => {
    try {
        let { page = 1, limit = 10, status } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const whereClause = status && status !== 'all' ? { status } : {};

        const count = await Booking.countDocuments(whereClause);
        const rows = await Booking.find(whereClause)
            .populate({
                path: 'car',
                select: 'brand model name mileage photo price type'
            })
            .populate({
                path: 'user',
                select: 'first_name last_name email mobile'
            })
            .populate({
                path: 'dealer',
                select: 'name email'
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

adminController.getDashboardStats = async (req, res) => {
    try {
        const [dealers, users, vehicles, bookings, recentBookings] = await Promise.all([
            Dealer.countDocuments(),
            User.countDocuments(),
            Car.countDocuments(),
            Booking.countDocuments(),
            Booking.find()
                .populate('user', 'name email')
                .populate('car', 'name brand type price')
                .populate('dealer', 'name')
                .sort({ createdAt: -1 })
                .limit(5)
        ]);

        res.json({
            success: true,
            data: {
                stats: {
                    dealers,
                    users,
                    vehicles,
                    bookings
                },
                recentBookings
            },
            message: "Dashboard stats fetched successfully"
        });
    } catch (e) {
        res.status(500).json({ success: false, message: "Failed to fetch dashboard stats", error: e.message });
    }
}
adminController.fetchUsers = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const count = await User.countDocuments();
        const rows = await User.find()
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
            message: "Users fetched successfully"
        });
    } catch (e) {
        res.status(500).json({ success: false, message: "Failed to fetch users", error: e.message });
    }
}
module.exports = adminController;

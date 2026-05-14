var express = require('express');
var adminRouter = express.Router();

var jwt=require('jsonwebtoken');
var secret_key='abcd#$%@12345678';

//json get krne ke liye
adminRouter.use(express.urlencoded({extended:true}));
adminRouter.use(express.json());

var cookieParser=require('cookie-parser');
adminRouter.use(cookieParser());


var adminController = require("../controllers/adminController");
const { body } = require('express-validator');
const { validate } = require('../middleware/validationMiddleware');


function AuthorizeAdmin(req,res,next)
{
    var token=req.cookies.AdminToken;
    if(!token)
    {
        res.status(401).json({ success: false, message: 'Login Required', error: 'Unauthorized' });
    }
    else {
        try
        {
            req.admin=jwt.verify(token,secret_key);
            next();
        }
        catch(e)
        {
            res.status(401).json({ success: false, message: 'Invalid Token', error: 'Unauthorized' });
        }
    }
}
//json value k liye middleware
function AuthorizeAdmin_HTTP(req,res,next)
{
    var token=req.cookies.AdminToken;
    if(!token)
    {
        res.status(401).json({ success: false, message: 'Unauthorized Access', error: 'Unauthorized' });
    }
    else {
        try
        {
            req.admin=jwt.verify(token,secret_key);
            next();
        }
        catch(e)
        {
            res.status(401).json({ success: false, message: 'Unauthorized Access', error: 'Unauthorized' });
        }
    }
}
//admin
adminRouter.get('/login',adminController.renderAdminPage)
adminRouter.post('/login', [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
], adminController.loginAdmin);
adminRouter.get('/token', AuthorizeAdmin_HTTP, adminController.checkToken);
adminRouter.get('/dashboard',AuthorizeAdmin,adminController.renderDashboard);

//manage dealer
adminRouter.get('/manage_dealer',AuthorizeAdmin,adminController.renderManageDealer);
adminRouter.get('/fetchDealer',AuthorizeAdmin_HTTP,adminController.fetchDealers);
adminRouter.put('/update_dealerstatus/:id',AuthorizeAdmin_HTTP,adminController.updateDealerStatus);
adminRouter.delete('/delete_dealer/:id',AuthorizeAdmin_HTTP,adminController.deleteDealer);
adminRouter.get('/fetchUsers', AuthorizeAdmin_HTTP, adminController.fetchUsers);

//send email
adminRouter.post('/send-email',AuthorizeAdmin_HTTP, adminController.sendEmail);

//manage category
adminRouter.get('/manage_category',AuthorizeAdmin,adminController.renderManageCategory);
adminRouter.post('/add_category', [
    AuthorizeAdmin_HTTP,
    body('name').notEmpty().withMessage('Category name is required'),
    validate
], adminController.addCategory);
adminRouter.get('/viewcategory',AuthorizeAdmin_HTTP,adminController.viewCategory);
adminRouter.put('/update_category/:id', AuthorizeAdmin_HTTP, adminController.updateCategory);
adminRouter.delete('/delete_category/:id',AuthorizeAdmin_HTTP,adminController.deleteCategory);

//change password and logout
adminRouter.get('/changePassword',AuthorizeAdmin_HTTP,adminController.changePassword);
adminRouter.put('/changePassword',AuthorizeAdmin_HTTP,adminController.updatePassword);
adminRouter.get('/logout',AuthorizeAdmin_HTTP,adminController.logout);

//view bookings
adminRouter.get('/view_booking',AuthorizeAdmin,adminController.renderBooking);
adminRouter.get('/fetchbooking',AuthorizeAdmin_HTTP,adminController.fetchBookings);
module.exports = adminRouter;
var express = require('express');
var dealerRouter = express.Router();
dealerRouter.use(express.json());
//post method wala object get krne ke liye
dealerRouter.use(express.urlencoded({extended: true}));

var cookieParser = require('cookie-parser');
dealerRouter.use(cookieParser());

var dealerController = require('../controllers/dealerController');
const jwt = require("jsonwebtoken");
const userController = require("../controllers/userController");
var secret_key = 'abcd#$%@12345678';
const { body } = require('express-validator');
const { validate } = require('../middleware/validationMiddleware');


function AuthorizeDealer(req, res, next) {
    var token = req.cookies.DealerToken;
    if (!token)
    {
        res.status(401).json({ success: false, message: 'Login Required', error: 'Unauthorized' });
    } else {
        try
        {
            req.dealer = jwt.verify(token, secret_key);
            next();
        } catch (e) {
            res.status(401).json({ success: false, message: 'Invalid Token', error: 'Unauthorized' });
        }
    }
}

//json value k liye middleware
function AuthorizeDealer_HTTP(req, res, next) {
    var token = req.cookies.DealerToken;

    if (!token)
    {
        res.status(401).json({ success: false, message: 'Login Required', error: 'Unauthorized' });
    } else {
        try
        {
            req.dealer = jwt.verify(token, secret_key);
            next();
        } catch (e) {
            res.status(401).json({ success: false, message: 'Unauthorized Access', error: 'Unauthorized' });
        }
    }
}


dealerRouter.get('/signup', dealerController.RenderSignup);
dealerRouter.get('/login',dealerController.RenderLogin);
dealerRouter.post('/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    validate
], dealerController.registerDealer);
dealerRouter.post('/login', [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
], dealerController.loginDealer);
dealerRouter.get('/dashboard',AuthorizeDealer,dealerController.renderDashBoard);
dealerRouter.get('/stats', AuthorizeDealer_HTTP, dealerController.getStats);
dealerRouter.get('/token', AuthorizeDealer_HTTP, dealerController.checkToken);

//logout
dealerRouter.get('/logout', AuthorizeDealer_HTTP, dealerController.logoutUser);
//render profile page
dealerRouter.get('/profile', AuthorizeDealer, dealerController.renderProfile);
dealerRouter.get('/showProfile', AuthorizeDealer_HTTP, dealerController.showProfile);
//update profile
dealerRouter.post('/updateProfile', AuthorizeDealer_HTTP, dealerController.updateProfile);
dealerRouter.put('/updateProfile/:id', AuthorizeDealer_HTTP, dealerController.updateProfile);
dealerRouter.put('/update_profile/:id', AuthorizeDealer_HTTP, dealerController.updateProfile2);
//render change password
dealerRouter.get('/changePassword', AuthorizeDealer, dealerController.changePassword);
dealerRouter.put('/changePassword', AuthorizeDealer_HTTP, dealerController.updatePassword);

//cars
dealerRouter.get('/manage_car',AuthorizeDealer,dealerController.renderManageCar);
dealerRouter.post('/addcar', [
    AuthorizeDealer_HTTP,
    body('name').notEmpty().withMessage('Car name is required'),
    body('brand').notEmpty().withMessage('Brand is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    validate
], dealerController.addCar);
dealerRouter.get('/fetchcategories',AuthorizeDealer_HTTP,dealerController.fetchCategories);
dealerRouter.get('/fetchcars',AuthorizeDealer_HTTP,dealerController.fetchcars);
dealerRouter.put('/updatecar/:id', AuthorizeDealer_HTTP, dealerController.updateCar);
dealerRouter.delete('/deletecar/:id',AuthorizeDealer_HTTP,dealerController.deleteCar);

//pending car req
dealerRouter.get('/car_req',AuthorizeDealer,dealerController.renderManageCarReq);
dealerRouter.get('/fetchcarreq',AuthorizeDealer_HTTP,dealerController.fetchCarReq);
dealerRouter.put('/updatereq/:id',AuthorizeDealer_HTTP,dealerController.UpdateCarReq);
dealerRouter.put('/updateCar/:id',AuthorizeDealer_HTTP,dealerController.updateCarStatus);
//manage approved req
dealerRouter.get('/view_approved_req',AuthorizeDealer,dealerController.renderApprovedReq);
dealerRouter.get('/fetchapprovedbooking',AuthorizeDealer_HTTP,dealerController.fetchApprovedReq);
//manage cancelled booking
dealerRouter.get('/view_cancelled_req',AuthorizeDealer,dealerController.renderCancelledReq);
dealerRouter.get('/fetchcancelledbooking',AuthorizeDealer_HTTP,dealerController.fetchCancelledReq);

//completed
dealerRouter.get('/view_completed_req',AuthorizeDealer,dealerController.renderCompletedReq);
dealerRouter.get('/fetchcompletedbooking',AuthorizeDealer_HTTP,dealerController.fetchCompletedReq);

//send email
dealerRouter.post('/send-email',AuthorizeDealer_HTTP, dealerController.sendEmail);

module.exports = dealerRouter;
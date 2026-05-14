var express = require('express');
var fileUpload = require('express-fileupload');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var morgan = require('morgan');
var connectDB = require('./mongodb.config');
var app = express();

// Connect MongoDB and Start Server
connectDB().then(() => {


// Middlewares
app.use(morgan('dev'));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static('public'));

// Routes
var indexRouter = require('./routes/index');
app.use("/api/v1", indexRouter);

var adminRouter = require('./routes/admin');
app.use("/api/v1/admin", adminRouter);

var userRouter = require('./routes/user');
app.use("/api/v1/user", userRouter);

var dealerRouter = require('./routes/dealer');
app.use('/api/v1/dealer', dealerRouter);


    var port = 5000;
    app.listen(port, (error) => {
        if (error) {
            console.log(error.message);
        } else {
            console.log("Server is running | http://localhost:" + port);
        }
    });
}).catch((err) => {
    console.error("Failed to start server due to DB connection error:", err.message);
});


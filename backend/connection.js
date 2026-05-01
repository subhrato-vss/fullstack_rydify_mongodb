var mysql = require('mysql');

var config = {
    host: 'localhost',
    user: 'root',
    password: 'system',
    database: 'fullstack_drive_deal'
};

var connection = mysql.createConnection(config);

connection.connect((error) => {
    if (error) {
        console.log(error.message);
    }
    else {
        console.log("database connected");
    }
});

module.exports = connection;
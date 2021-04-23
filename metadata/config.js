var mysql = require('mysql');

var con = mysql.createConnection({
    host: "agitechsample.clbifhef4gsa.us-east-2.rds.amazonaws.com",
    port: 3306,
    user: "handson",
    password: "handsonhandson",
    database: "Financial_management_system"
});

module.exports = con;
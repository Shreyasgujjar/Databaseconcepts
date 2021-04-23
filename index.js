require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var cors = require("cors");
const connectDb = require("./database/db");

const app = express();
const port = process.env.PORT || 3000;

const users = require("./routes/User");
const facultyGrantInformation = require("./routes/FacultyGrantInformation");
const studentHireData = require("./routes/StudentHireData");
const purchase = require("./routes/Purchase");
const facultyPay = require("./routes/FacultyPay");

const http = require('http').createServer(app);

connectDb();

app.use(express.static(__dirname, { dotfiles: 'allow' }));
app.use(express.json({ extended: true }));
app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({ origin: true, credentials: false }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use("/users", users);
app.use("/facultygrantinfo", facultyGrantInformation);
app.use("/purchase", purchase);
app.use("/studenthire", studentHireData);
app.use("facultypay", facultyPay);

http.listen(port, () => console.log("app running at - " + port))
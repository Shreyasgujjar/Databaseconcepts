const express = require('express');
const router = express.Router();
var con = require('../metadata/config');
const { getBalance } = require('./FacultyGrantInformation');

router.post("/", async (req, res) => {
    var query = `INSERT INTO FACULTY_PAY VALUES (NULL, '${req.body.PaymentType}', ${req.body.PaymentAmount}, '${req.body.PaymentStartDate}', '${req.body.PaymentEndDate}', '${req.body.UserId}', '${req.body.Status}')`;
    con.query(query, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "There was a problem creating the pay information",
                status: 'FAILURE'
            })
        } else {
            query = `INSERT INTO GRANT_PAY VALUES (${req.body.GrantId}, ${results.insertId})`;
            con.query(query, (err, results, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        message: "There was a problem creating the mapping information",
                        status: 'FAILURE'
                    })
                } else {
                    res.status(200).json({
                        message: "Payment information created successfully",
                        status: "SUCCESS"
                    })
                }
            })
        }
    })
})

router.get("/", (req, res) => {
    var query = "SELECT * FROM FACULTY_PAY";
    con.query(query, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "There was a problem fetching the payment information",
                status: 'FAILURE'
            })
        } else {
            res.status(200).json({
                message: "Payment information fetched successfully",
                status: "SUCCESS",
                data: results
            })
        }
    })
})

router.get("/getallrequests/:userid", (req, res) => {
    // var query = `SELECT * FROM FACULTY_PAY AS F,   WHERE F.PaymentId IN (SELECT PaymentId FROM GRANT_PAY WHERE GrantId IN (SELECT GrantId FROM GRANT_DATA WHERE UserId = ${req.params.userid}))`;
    var query = `SELECT F.PaymentId, F.UserId, U.FirstName, U.MiddleName, U.LastName, F.PaymentType, F.PaymentAmount, F.PaymentStartDate, F.PaymentEndDate, F.Status FROM FACULTY_PAY AS F, GRANT_PAY AS P, GRANT_DATA AS D, FACULTY_GRANT_INFORMATION AS G, USERS AS U WHERE F.PaymentId = P.PaymentId AND G.GrantId = P.GrantId AND P.GrantId = D.GrantId AND D.UserId = U.UserId AND U.UserId = ${req.params.userid}`;
    con.query(query, async (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "There was a problem fetching the payment information",
                status: 'FAILURE'
            })
        } else {
            for(var i = 0; i < results.length; i++){
                var userDetails = await getUserDetails(results[i].UserId, '');
                results[i].FirstName = userDetails[0].FirstName;
                results[i].MiddleName = userDetails[0].MiddleName;
                results[i].LastName = userDetails[0].LastName;
                results[i].Email = userDetails[0].Email;
            }
            res.status(200).json({
                message: "Payment information fetched successfully",
                status: "SUCCESS",
                data: results
            })
        }
    })
})

router.get("/search/:userid", (req, res) => {
    if(req.query.searchData == undefined){
        req.query.searchData = '';
    }
    // var query = `SELECT * FROM FACULTY_PAY AS F,   WHERE F.PaymentId IN (SELECT PaymentId FROM GRANT_PAY WHERE GrantId IN (SELECT GrantId FROM GRANT_DATA WHERE UserId = ${req.params.userid}))`;
    var query = `SELECT F.PaymentId, F.UserId, U.FirstName, U.MiddleName, U.LastName, F.PaymentType, F.PaymentAmount, F.PaymentStartDate, F.PaymentEndDate, F.Status FROM FACULTY_PAY AS F, GRANT_PAY AS P, GRANT_DATA AS D, FACULTY_GRANT_INFORMATION AS G, USERS AS U WHERE F.PaymentId = P.PaymentId AND G.GrantId = P.GrantId AND P.GrantId = D.GrantId AND D.UserId = U.UserId AND U.UserId = ${req.params.userid} AND (F.PaymentType LIKE '%${req.query.searchData}%' OR F.PaymentAmount LIKE '%${req.query.searchData}%')`;
    con.query(query, async (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "There was a problem fetching the payment information",
                status: 'FAILURE'
            })
        } else {
            for(var i = 0; i < results.length; i++){
                var userDetails = await getUserDetails(results[i].UserId, '');
                results[i].FirstName = userDetails[0].FirstName;
                results[i].MiddleName = userDetails[0].MiddleName;
                results[i].LastName = userDetails[0].LastName;
                results[i].Email = userDetails[0].Email;
            }
            res.status(200).json({
                message: "Payment information fetched successfully",
                status: "SUCCESS",
                data: results
            })
        }
    })
})

router.get("/totalpay/:userid", (req, res) => {
    var query = `SELECT SUM(PaymentAmount) as total FROM FACULTY_PAY WHERE PaymentId IN (SELECT PaymentId FROM GRANT_PAY WHERE GrantId IN (SELECT GrantId FROM GRANT_DATA WHERE UserId = ${req.params.userid}))`;
    con.query(query, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "There was a problem fetching the payment information",
                status: 'FAILURE'
            })
        } else {
            res.status(200).json({
                message: "Payment information fetched successfully",
                status: "SUCCESS",
                result: results
            })
        }
    })
})

router.get("/getspecific/:id", (req, res) => {
    var query = "SELECT * FROM FACULTY_PAY WHERE PaymentId = " + req.params.id;
    con.query(query, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "There was a problem fetching the payment information",
                status: 'FAILURE'
            })
        } else {
            res.status(200).json({
                message: "Payment information fetched successfully",
                status: "SUCCESS",
                data: results
            })
        }
    })
})

router.put("/changeapprovalstatus/:paymentId", (req, res) => {
    var query = `UPDATE FACULTY_PAY SET Status = ${req.body.Status} WHERE PaymentId = ${req.params.paymentId}`;
    con.query(query, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).json({
                message: "There was an error updating the payment details",
                status: "FAILURE"
            })
        } else {
            res.status(200).json({
                message: "The Payment details were updated successfully",
                status: "SUCCESS"
            })
        }
    })
})

async function getUserDetails(userId, searchData){
    return new Promise((resolve, reject) => {
        var query = `SELECT * FROM USERS WHERE UserId = ${userId} AND (FirstName LIKE '%${searchData}%' OR LastName LIKE '%${searchData}%' OR MiddleName LIKE '%${searchData}%' OR Email LIKE '%${searchData}%')`;
        con.query(query, (err, result) => {
            resolve(result);
        })
    })
}

module.exports = router;
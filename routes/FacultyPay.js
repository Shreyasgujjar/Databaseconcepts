const express = require('express');
const router = express.Router();
var con = require('../metadata/config');

router.post("/", (req, res) => {
    var query = `INSERT INTO FACULTY_PAY (NULL, ${req.body.PaymentAmount}, '${req.body.PaymentDate}', '${req.body.Userid}')`;
    con.query(query, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "There was a problem creating the pay information",
                status: 'FAILURE'
            })
        } else {
            query = `INSERT INTO GRANT_PAY VALUES (${req.body.GrantId}, ${results[0].PaymentId})`;
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

module.exports = router;
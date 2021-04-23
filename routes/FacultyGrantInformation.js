const express = require('express');
const router = express.Router();
var con = require('../metadata/config');

router.post("/", (req, res) => {
    var query = `INSERT INTO FACULTY_GRANT_INFORMATION VALUES (NULL, '${req.body.GrantType}', '${req.body.GrantFrom}', '${req.body.GrantAmount}', '${req.body.GrantStartDate}', '${req.body.GrantEndDate}')`;
    con.query(query, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "There was a problem creating the grant information",
                status: 'FAILURE'
            })
        } else {
            res.status(200).json({
                message: "Grant information created successfully",
                status: "SUCCESS"
            })
        }
    })
})

router.get("/", (req, res) => {
    var query = `SELECT * FROM FACULTY_GRANT_INFORMATION`;
    con.query(query, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "There was a problem fetching the grant information",
                status: 'FAILURE'
            })
        } else {
            res.status(200).json({
                message: "Grant information fetched successfully",
                status: "SUCCESS",
                data: results
            })
        }
    })
})

router.get("/getspecific/:id", (req, res) => {
    var query = "SELECT * FROM FACULTY_GRANT_INFORMATION WHERE GrantId = " + req.params.id;
    con.query(query, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "There was a problem fetching the grant information",
                status: 'FAILURE'
            })
        } else {
            res.status(200).json({
                message: "Grant information fetched successfully",
                status: "SUCCESS",
                data: results
            })
        }
    })
})

module.exports = router;
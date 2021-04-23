const express = require('express');
const router = express.Router();
var con = require('../metadata/config');

router.post("/", (req, res) => {
    var query = `INSERT INTO STUDENT_HIRE_DATA VALUES (NULL, '${req.body.FirstName}', '${req.body.LastName}', '${req.body.UIN}', '${req.body.Salary}', '${req.body.EmploymentType}', '${req.body.WorkLoad}', '${req.body.StartDate}', '${req.body.EndDate}'`;
    con.query(query, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "There was a problem creating the Hire information",
                status: 'FAILURE'
            })
        } else {
            res.status(200).json({
                message: "Hire information created successfully",
                status: "SUCCESS"
            })
        }
    })
})

router.get("/", (req, res) => {
    var query = "SELECT * FROM STUDENT_HIRE_DATA";
    con.query(query, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "There was a problem fetching the Hire information",
                status: 'FAILURE'
            })
        } else {
            res.status(200).json({
                message: "Hire information fetched successfully",
                status: "SUCCESS",
                data: results
            })
        }
    })
})

router.get("/getspecific/:id", (req, res) => {
    var query = "SELECT * FROM STUDENT_HIRE_DATA WHERE HireId = " + req.params.id;
    con.query(query, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "There was a problem fetching the hire information",
                status: 'FAILURE'
            })
        } else {
            res.status(200).json({
                message: "Hire information fetched successfully",
                status: "SUCCESS",
                data: results
            })
        }
    })
})

module.exports = router;
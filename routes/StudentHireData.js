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
            query = `INSERT INTO GRANT_HIRE VALUES (${req.body.GrantId}, ${results[0].HireId})`;
            con.query(query, (err, results, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        message: "There was a problem creating the mapping information",
                        status: 'FAILURE'
                    })
                } else {
                    res.status(200).json({
                        message: "Hire information created successfully",
                        status: "SUCCESS"
                    })
                }
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

router.get("/gethireforgrant/:grantid", (req, res) => {
    var query = `SELECT * FROM STUDENT_HIRE_DATA WHERE HireId IN (SELECT HireId FROM GRANT_HIRE WHERE GrantId = ${req.params.grantid})`;
    con.query(query, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).json({
                message: "There was an error finding the hires for the given grant",
                status: "SUCCESS"
            })
        } else {
            res.status(200).json({
                message: "Successfully detched the data",
                status: "SUCCESS",
                data: result
            })
        }
    })
})

router.put("/edithire/:hireId", (req, res) => {
    var query = `UPDATE STUDENT_HIRE_DATA SET FirstName = '${req.body.FirstName}', LastName = '${req.body.LastName}', UIN = '${req.body.UIN}', Salary = '${req.body.Salary}', EmploymentType = '${req.body.EmploymentType}', WorkLoad = '${req.body.WorkLoad}', StartDate = '${req.body.StartDate}', EndDate = '${req.body.EndDate}' WHERE HireId = ${req.params.hireId}`;
    con.query(query, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).json({
                message: "There was an error editing the hire information",
                status: "FAILURE"
            })
        } else {
            res.status(200).json({
                message: "Successfully edited the hire details",
                status: "SUCCESS"
            })
        }
    })
})

router.delete("/deletehire/:hireId", (req, res) => {
    var query = `DELETE FROM STUDENT_HIRE_DATA WHERE HireId = ${req.params.hireId}`;
    con.query(query, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).json({
                message: "There was an error deleting the hire details",
                status: "FAILURE"
            })
        } else {
            res.status(200).json({
                message: "The Hire details were deleted successfully",
                status: "SUCCESS"
            })
        }
    })
})

module.exports = router;
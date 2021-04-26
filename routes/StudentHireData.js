const express = require('express');
const router = express.Router();
var con = require('../metadata/config');
const { getBalance } = require('./FacultyGrantInformation');

router.post("/", async (req, res) => {
    var balance = await getBalance(req.body.UserId);
    balance = balance.result;
    for(var i = 0; i < balance.length; i++){
        if(balance[i].GrantId == req.body.GrantId){
            balance = balance[i].balance
            break;
        }
    }
    if(balance - req.body.Salary > 0){
        var query = `SELECT * FROM STUDENT_HIRE_DATA WHERE UIN = ${req.body.UIN}`;
        con.query(query, (err, results) => {
            if(err){
                console.log(err);
                res.status(500).json({
                    message: "There was an error creating the hire",
                    status: "FAILURE"
                })
            }else{
                if(results.length < 2){
                    query = `INSERT INTO STUDENT_HIRE_DATA VALUES (NULL, '${req.body.FirstName}', '${req.body.MiddleName}', '${req.body.LastName}', '${req.body.Semester}', '${req.body.Degree}', '${req.body.UIN}', '${req.body.Salary}', '${req.body.EmploymentType}', '${req.body.WorkLoad}', '${req.body.StartDate}', '${req.body.EndDate}', '${req.body.Status}')`;
                    con.query(query, (err, results, fields) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({
                                message: "There was a problem creating the Hire information",
                                status: 'FAILURE'
                            })
                        } else {
                            query = `INSERT INTO GRANT_HIRE VALUES (${req.body.GrantId}, ${results.insertId})`;
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
                }else {
                    res.status(400).json({
                        message: "Student has maximum number of jobs already",
                        status: "FAILURE"
                    })
                }
            }
        })
    }else {
        res.status(400).json({
            message: "There is no enough balance to hire a student",
            status: "FAILURE"
        })
    }
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

router.get("/admin/:userid", (req, res) => {
    // var query = `SELECT * FROM STUDENT_HIRE_DATA WHERE HireId IN (SELECT HireId FROM GRANT_HIRE WHERE GrantId IN (SELECT GrantId FROM GRANT_DATA WHERE UserId = ${req.params.userid}))`;
    var query = `SELECT S.HireId, S.FirstName, S.MiddleName, S.LastName, S.Semester, S.Degree, S.UIN, S.Workload, S.EmploymentType, S.Salary, S.Status, S.StartDate, S.EndDate, F.GrantType, F.GrantFrom, F.GrantAmount FROM STUDENT_HIRE_DATA AS S, GRANT_HIRE AS G, FACULTY_GRANT_INFORMATION AS F, GRANT_DATA AS D, USERS AS U WHERE S.HireId = G.HireId AND G.GrantId = F.GrantId AND D.GrantId = G.GrantId AND D.UserId = U.UserId AND U.UserId = ${req.params.userid}`;
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

router.get("/search/:userid", (req, res) => {
    if(req.query.searchData == undefined){
        req.query.searchData = '';
    }
    // var query = `SELECT * FROM STUDENT_HIRE_DATA WHERE HireId IN (SELECT HireId FROM GRANT_HIRE WHERE GrantId IN (SELECT GrantId FROM GRANT_DATA WHERE UserId = ${req.params.userid}))`;
    var query = `SELECT S.HireId, S.FirstName, S.MiddleName, S.LastName, S.Semester, S.Degree, S.UIN, S.Workload, S.EmploymentType, S.Salary, S.Status, S.StartDate, S.EndDate, F.GrantType, F.GrantFrom, F.GrantAmount FROM STUDENT_HIRE_DATA AS S, GRANT_HIRE AS G, FACULTY_GRANT_INFORMATION AS F, USERS AS U WHERE  S.HireId = G.HireId AND G.GrantId = F.GrantId AND U.UserId = ${req.params.userid} AND (S.FirstName LIKE '%${req.query.searchData}%' OR S.LastName LIKE '%${req.query.searchData}%' OR S.MiddleName LIKE '%${req.query.searchData}%' OR S.Semester LIKE '%${req.query.searchData}%' OR S.Degree LIKE '%${req.query.searchData}%' OR S.UIN LIKE '%${req.query.searchData}%' OR S.Workload LIKE '%${req.query.searchData}%' OR S.EmploymentType LIKE '%${req.query.searchData}%' OR S.Status LIKE '%${req.query.searchData}%' OR F.GrantType LIKE '%${req.query.searchData}%' OR F.GrantFrom LIKE '%${req.query.searchData}%' OR F.GrantAmount LIKE '%${req.query.searchData}%')`;
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

router.get("/totalhireamount/:userid", (req, res) => {
    var query = `SELECT SUM(Salary) as total FROM STUDENT_HIRE_DATA WHERE HireId IN (SELECT HireId FROM GRANT_HIRE WHERE GrantId IN (SELECT GrantId FROM GRANT_DATA WHERE UserId = ${req.params.userid}))`;
    con.query(query, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).json({
                message: "There was a problem getting the total of hiring",
                status: "FAILURE"
            })
        } else {
            res.status(200).json({
                message: "Retrived all information",
                status: "SUCCESS",
                result: result
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

router.put("/edithire/:hireId", async (req, res) => {
    var balance = await getBalance(req.body.UserId);
    balance = balance.result;
    for(var i = 0; i < balance.length; i++){
        if(balance[i].GrantId == req.body.GrantId){
            balance = balance[i].balance
            break;
        }
    }
    if(balance - req.body.Salary > 0){
        var query = `UPDATE STUDENT_HIRE_DATA SET FirstName = '${req.body.FirstName}', LastName = '${req.body.LastName}', UIN = '${req.body.UIN}', Degree = '${req.body.Degree}', Semester = '${req.body.Semester}', Salary = '${req.body.Salary}', EmploymentType = '${req.body.EmploymentType}', WorkLoad = '${req.body.WorkLoad}', StartDate = '${req.body.StartDate}', EndDate = '${req.body.EndDate}' WHERE HireId = ${req.params.hireId}`;
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
    } else {
        res.status(400).json({
            message: "There is no enough balance to hire a student",
            status: "FAILURE"
        })
    }
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

router.put("/changeapprovalstatus/:hireId", (req, res) => {
    var query = `UPDATE STUDENT_HIRE_DATA SET Status = ${req.body.Status} WHERE HireId = ${req.params.hireId}`;
    con.query(query, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).json({
                message: "There was an error updating the hire details",
                status: "FAILURE"
            })
        } else {
            res.status(200).json({
                message: "The Hire details were updated successfully",
                status: "SUCCESS"
            })
        }
    })
})

module.exports = router;
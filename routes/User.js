const express = require('express');
const router = express.Router();
var con = require('../metadata/config');
const saltHash = require("../helper/saltHash");
const otp = require("otp-generator");
const { validatePass } = require('../helper/saltHash');
const email = require('../helper/email');

router.post("/", (req, res) => {
    con.query("SELECT email FROM USERS WHERE email = " + "'" + req.body.Email + "'", async(err, result, fields) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "There was a problem creating the user",
                status: 'FAILURE'
            })
        } else {
            if (result.length != 0) {
                res.status(400).json({
                    message: "It seems as if the contact information for the user is already created.",
                    status: 'BAD_REQUEST'
                })
            } else{
                let password = req.body.Password;
                var hashPass = await saltHash.genSalt(password);
                if(hashPass){
                    var query = "INSERT INTO USERS VALUES(NULL," +
                        "'" + req.body.FirstName + "'," +
                        "'" + req.body.MiddleName + "'," +
                        "'" + req.body.LastName + "'," +
                        "'" + req.body.Address + "'," +
                        "'" + req.body.OfficePhone + "'," +
                        "'" + req.body.CellPhone + "'," +
                        "'" + req.body.Email + "'," +
                        "'" + hashPass + "'," +
                        "'" + 0 + "')";
                    con.query(query, async(err, result) => {
                        if (err) {
                            console.log(err)
                            res.status(500).json({
                                message: "There was a problem while creating the user",
                                status: 'FAILURE'
                            })
                        } else {
                            if(await email.registerSuccessfull("You have been successfully registered to the Financial Management system. You wont be able to see any data on the front end until a grant is assigned to you.\n\nThanks,\nFinancial Management System.\nOld Dominion University\nNorfolk, 23529", req.body.Email)){
                                res.status(200).json({
                                    message: "User has been created successfully and an email has been sent to the user",
                                    status: 'SUCCESS',
                                    userId: result.insertId
                                })
                            }else {
                                res.status(500).json({
                                    message: "There was an error sending the email",
                                    status: "FAILURE"
                                })
                            }
                        }
                    });
                }else{
                    res.status(500).json({
                        message: "There was a problem while creating the password",
                        status: 'FAILURE'
                    })
                }
            }
        }
    })
})

router.post("/admin", (req, res) => {
    con.query("SELECT email FROM USERS WHERE email = " + "'" + req.body.email + "'", async(err, result, fields) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "There was a problem creating the user",
                status: 'FAILURE'
            })
        } else {
            if (result.length != 0) {
                res.status(400).json({
                    message: "It seems as if the contact information for the user is already created.",
                    status: 'BAD_REQUEST'
                })
            } else{
                var samplePassword = otp.generate(8, { specialChars: false });
                var hashPass = await saltHash.genSalt(samplePassword);
                if(hashPass){
                    var query = "INSERT INTO USERS VALUES(NULL," +
                        "'" + req.body.FirstName + "'," +
                        "'" + req.body.MiddleName + "'," +
                        "'" + req.body.LastName + "'," +
                        "'" + req.body.Address + "'," +
                        "'" + req.body.OfficePhone + "'," +
                        "'" + req.body.CellPhone + "'," +
                        "'" + req.body.Email + "'," +
                        "'" + hashPass + "'," +
                        "'" + 0 + "')";
                    con.query(query, async(err, result) => {
                        if (err) {
                            console.log(err)
                            res.status(500).json({
                                message: "There was a problem while creating the user",
                                status: 'FAILURE'
                            })
                        } else {
                            if(await email.registerSuccessfull("You have been successfully registered to the Financial Management system. You can make use of the email - " + req.body.Email + " and password - " + samplePassword + " to login and view the information" + "\n\nThanks,\nFinancial Management System.\nOld Dominion University\nNorfolk, 23529", req.body.Email)){
                                res.status(200).json({
                                    message: "User has been created successfully and an email has been sent to the user",
                                    status: 'SUCCESS'
                                })
                            }else {
                                res.status(500).json({
                                    message: "There was an error sending the email",
                                    status: "FAILURE"
                                })
                            }
                        }
                    });
                }else{
                    res.status(500).json({
                        message: "There was a problem while creating the password",
                        status: 'FAILURE'
                    })
                }
            }
        }
    })
})

router.post("/frgtpass", (req, res) => {
    var query = `SELECT * FROM USERS WHERE Email = '${req.body.email}'`;
    con.query(query, async (err, result) => {
        if(err){
            res.status(500).json({
                message: "There was a problem while finding the user",
                status: "FAILURE"
            })
        } else {
            if(result.length != 0){
                var samplePassword = otp.generate(8, { upperCase: false, specialChars: false, alphabets: false });
                var hashPass = await saltHash.genSalt(samplePassword);
                query = `UPDATE USERS SET Password = '${hashPass}' WHERE Email = '${req.body.email}'`;
                con.query(query, async (err, results) => {
                    if(err){
                        console.log(err);
                        res.status(500).json({
                            message: "There was an error updating the password",
                            status: "FAILURE"
                        });
                    }else{
                        var emailSent = await email.frgtpass(`Please use the temporary password ${samplePassword} to login and change the password.\n\nThanks,\nFinancial Management Team.`, req.body.email);
                        if(emailSent){
                            res.status(200).json({
                                message: "A temporary password has been sent to your email id",
                                status: "SUCCESS"
                            });
                        }else{
                            res.status(500).json({
                                message: "There was an error sending the password",
                                status: "FAILURE"
                            });
                        }
                    }
                })
            } else {
                res.status(400).json({
                    message: "There was an error finding the specified user",
                    status: "FAILURE"
                })
            }
        }
    })
})

router.post("/login", (req, res) => {
    var query = "SELECT Password, SuperUser, UserId FROM USERS WHERE Email = '" + req.body.Email + "'";
    con.query(query, async (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json({
                message: "There was a problem while fetching the user",
                status: 'FAILURE',
            })
        }else{
            if(result.length > 0){
                if(await validatePass(req.body.Password, result[0].Password)){
                    res.status(200).json({
                        message: "Successfully fetched the data",
                        status: 'SUCCESS',
                        superuser: result[0].SuperUser,
                        userId: result[0].UserId
                    })
                } else {
                    res.status(400).json({
                        message: "Wrong Password",
                        status: 'FAILURE'
                    })
                }
            } else {
                res.status(400).json({
                    message: "No user with the specified email found",
                    status: "FAILURE"
                })
            }
        }
    }); 
})

router.get("/", (req, res) => {
    var query = "SELECT * FROM USERS";
    con.query(query, (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json({
                message: "There was a problem while creating the user",
                status: 'FAILURE',
            })
        }else{
            res.status(200).json({
                message: "Successfully fetched the data",
                status: 'SUCCESS',
                result: result
            })
        }
    }); 
})

router.get("/getspecific/:userid", (req, res) => {
    var query = `SELECT * FROM USERS WHERE UserId = ${req.params.userid}`;
    con.query(query, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).json({
                message: "There was an error finding the user",
                status: "SUCCESS"
            })
        }else {
            if(result.length != 0){
                res.status(200).json({
                    message: "Found the user successfully",
                    status: "SUCCESS",
                    data: result
                })
            }else {
                res.status(400).json({
                    message: "Could not find the user",
                    status: "FAILURE"
                })
            }
        }
    })
})

router.get("/search", (req, res) => {
    var query = `SELECT * FROM USERS WHERE FirstName LIKE '%${req.query.searchData}%' OR MiddleName LIKE '%${req.query.searchData}%' OR LastName LIKE '%${req.query.searchData}%' OR Address LIKE '%${req.query.searchData}%' OR OfficePhone LIKE '%${req.query.searchData}%' OR CellPhone LIKE '%${req.query.searchData}%' OR Email LIKE '%${req.query.searchData}%'`;
    con.query(query, (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json({
                message: "There was a problem while creating the user",
                status: 'FAILURE',
            })
        }else{
            res.status(200).json({
                message: "Successfully fetched the data",
                status: 'SUCCESS',
                result: result
            })
        }
    }); 
})

router.put("/resetpwd/:userid", (req, res) => {
    var query = `SELECT * FROM USERS WHERE UserId = '${req.params.userid}'`;
    console.log(req.body);
    con.query(query, async (err, result) => {
        if(err){
            res.status(500).json({
                message: "There was a problem while finding the user",
                status: "FAILURE"
            })
        }else{
            if(result.length != 0){
                console.log(result[0].Password)
                if(await validatePass(req.body.OldPassword, result[0].Password)){
                    var samplePassword = req.body.Password;
                    var hashPass = await saltHash.genSalt(samplePassword);
                    query = `UPDATE USERS SET Password = '${hashPass}' WHERE UserId = '${req.params.userid}'`;
                    con.query(query, async (err, results) => {
                        if(err){
                            console.log(err);
                            res.status(500).json({
                                message: "There was an error updating the password",
                                status: "FAILURE"
                            });
                        }else{
                            res.status(200).json({
                                message: "Password reset successfull",
                                status: "SUCCESS"
                            });
                        }
                    })
                }else{
                    res.status(400).json({
                        message: "The old password is wrong",
                        status: "FAILURE"
                    })
                }
            }else{
                res.status(400).json({
                    message: "There was an error finding the specified user",
                    status: "FAILURE"
                })
            }
        }
    })
})

router.put("/edituserdet/:userid", (req, res) => {
    var query = `UPDATE USERS SET FirstName = '${req.body.FirstName}', LastName = '${req.body.LastName}', Address = '${req.body.Address}', OfficePhone = '${req.body.OfficePhone}', CellPhone = '${req.body.CellPhone}' WHERE UserId = ${req.params.userid}`;
    con.query(query, (err, result) => {
        if(err){
            console.log(error);
            res.status(500).json({
                message: "There was an error updating the data",
                status: "FAILURE"
            })
        }else {
            res.status(200).json({
                message: "Successfully updated the users data",
                status: "SUCCESS"
            })
        }
    })
})

router.delete("/deleteuserdet/:userid", (req, res) => {
    var query = `DELETE FROM USERS WHERE UserId = ${req.params.userid}`;
    con.query(query, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).json({
                message: "There was an error deleting the data",
                status: "FAILURE"
            })
        }else {
            res.status(200).json({
                message: "Successfully deleted the users data",
                status: "SUCCESS"
            })
        }
    })
})

module.exports = router;
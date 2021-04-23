const express = require('express');
const router = express.Router();
var con = require('../metadata/config');
const saltHash = require("../helper/saltHash");
const { validatePass } = require('../helper/saltHash');

router.post("/", (req, res) => {
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
                let password = req.body.Password;
                var hashPass = await saltHash.genSalt(password);
                if(hashPass){
                    var query = "INSERT INTO USERS VALUES(NULL," +
                        "'" + req.body.FirstName + "'," +
                        "'" + req.body.LastName + "'," +
                        "'" + req.body.Address + "'," +
                        "'" + req.body.OfficePhone + "'," +
                        "'" + req.body.CellPhone + "'," +
                        "'" + req.body.Email + "'," +
                        "'" + hashPass + "'," +
                        "'" + req.body.SuperUser + "')";
                    con.query(query, async(err, result) => {
                        if (err) {
                            console.log(err)
                            res.status(500).json({
                                message: "There was a problem while creating the user",
                                status: 'FAILURE'
                            })
                        } else {
                            res.status(200).json({
                                message: "User has been created successfully and an email has been sent to the user",
                                status: 'SUCCESS'
                            })
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

router.post("/login", (req, res) => {
    var query = "SELECT Password FROM USERS WHERE Email = '" + req.body.Email + "'";
    con.query(query, async (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json({
                message: "There was a problem while fetching the user",
                status: 'FAILURE',
            })
        }else{
            if(await validatePass(req.body.Password, result[0].Password)){
                res.status(200).json({
                    message: "Successfully fetched the data",
                    status: 'SUCCESS',
                })
            } else {
                res.status(400).json({
                    message: "WRONG PASSWORD",
                    status: 'FAILURE'
                })
            }
        }
    }); 
})

module.exports = router;
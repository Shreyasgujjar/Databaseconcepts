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
    if(balance - (req.body.Quantity * req.body.UnitCost) > 0){
        var query = `INSERT INTO PURCHASE VALUES (NULL, '${req.body.ItemName}', '${req.body.Quantity}', '${req.body.Link}', '${req.body.UnitCost}', '${(req.body.Quantity * req.body.UnitCost)}', '${req.body.Purchaser}', '${req.body.OrderDate}', '${req.body.DeliveryDate}', '${req.body.ApprovalStatus}', '${req.body.Status}', '${req.body.GrantId}')`;
        con.query(query, (err, results, fields) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    message: "There was a problem creating the purchase information",
                    status: 'FAILURE'
                })
            } else {
                res.status(200).json({
                    message: "Purchase information created successfully",
                    status: "SUCCESS"
                })
            }
        })
    }else {
        res.status(400).json({
            message: "Insufficient balance",
            status: "FAILURE"
        })
    }
})

router.get("/", (req, res) => {
    var query = "SELECT * FROM PURCHASE";
    con.query(query, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "There was a problem fetching the purchase information",
                status: 'FAILURE'
            })
        } else {
            res.status(200).json({
                message: "Purchase information fetched successfully",
                status: "SUCCESS",
                data: results
            })
        }
    })
})

router.get("/getforgrant/:grantid", (req, res) => {
    var query = `SELECT * FROM PURCHASE WHERE GrantId = ${req.params.grantid}`;
    con.query(query, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).json({
                message: "There was an error finding the specified grant id",
                status: "FAILURE"
            })
        }else{
            res.status(200).json({
                message: "Fetched all purchases successfully",
                status: "SUCCESS",
                data: result
            })
        }
    })
})

router.get("/getsumforfaculty/:userid", (req, res) => {
    var query = `SELECT SUM(TotalCost) AS total FROM PURCHASE WHERE GrantId IN (SELECT GrantId FROM GRANT_DATA WHERE UserId = ${req.params.userid});`
    con.query(query, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).json({
                message: "There was a problem getting the total of purchase",
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

router.get("/admin/:userid", (req, res) => {
    var query = `SELECT P.PurchaseId, P.ItemName, P.Quantity, P.UnitCost, P.TotalCost, P.OrderDate, P.DeliveryDate, P.ApprovalStatus, P.Status, F.GrantType, F.GrantFrom, F.GrantAmount, P.Purchaser as UserId FROM PURCHASE AS P, FACULTY_GRANT_INFORMATION AS F, USERS AS U, GRANT_DATA AS G WHERE P.GrantId = G.GrantId AND F.GrantId = P.GrantId AND G.UserId = U.UserId AND U.UserId = ${req.params.userid}`;
    con.query(query, async (err, result) => {
        if(err){
            console.log(err);
            res.status(500).json({
                message: "There was an error retriving the data",
                status: "FAILURE"
            })
        }else{
            for(var i = 0; i < result.length; i++){
                var userDetails = await getUserDetails(result[i].UserId, '');
                result[i].FirstName = userDetails[0].FirstName;
                result[i].MiddleName = userDetails[0].MiddleName;
                result[i].LastName = userDetails[0].LastName;
                result[i].Email = userDetails[0].Email;
            }
            res.status(200).json({
                message: "Fetched all purchases successfully",
                status: "SUCCESS",
                data: result
            })
        }
    })
})

router.get("/search/:userid", (req, res) => {
    if(req.query.searchData == undefined){
        req.query.searchData = '';
    }
    var query = `SELECT P.PurchaseId, P.ItemName, P.Quantity, P.UnitCost, P.TotalCost, P.OrderDate, P.DeliveryDate, P.ApprovalStatus, P.Status, F.GrantType, F.GrantFrom, F.GrantAmount, P.Purchaser as UserId FROM PURCHASE AS P, FACULTY_GRANT_INFORMATION AS F, USERS AS U, GRANT_DATA AS G WHERE P.GrantId = G.GrantId AND F.GrantId = P.GrantId AND G.UserId = U.UserId AND U.UserId = ${req.params.userid} AND (P.ItemName LIKE '%${req.query.searchData}%' OR P.Quantity LIKE '%${req.query.searchData}%' OR P.UnitCost LIKE '%${req.query.searchData}%' OR P.TotalCost LIKE '%${req.query.searchData}%' OR P.OrderDate LIKE '%${req.query.searchData}%' OR P.DeliveryDate LIKE '%${req.query.searchData}%' OR P.ApprovalStatus LIKE '%${req.query.searchData}%' OR P.Status LIKE '%${req.query.searchData}%' OR F.GrantType LIKE '%${req.query.searchData}%' OR F.GrantFrom LIKE '%${req.query.searchData}%' OR F.GrantAmount LIKE '%${req.query.searchData}%')`;
    con.query(query, async (err, result) => {
        if(err){
            console.log(err);
            res.status(500).json({
                message: "There was an error retriving the data",
                status: "FAILURE"
            })
        }else{
            for(var i = 0; i < result.length; i++){
                var userDetails = await getUserDetails(result[i].UserId, '');
                result[i].FirstName = userDetails[0].FirstName;
                result[i].MiddleName = userDetails[0].MiddleName;
                result[i].LastName = userDetails[0].LastName;
                result[i].Email = userDetails[0].Email;
            }
            res.status(200).json({
                message: "Fetched all purchases successfully",
                status: "SUCCESS",
                data: result
            })
        }
    })
})

router.get("/getspecific/:id", (req, res) => {
    var query = "SELECT * FROM PURCHASE WHERE PurchaseId = " + req.params.id;
    con.query(query, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "There was a problem fetching the purchase information",
                status: 'FAILURE'
            })
        } else {
            res.status(200).json({
                message: "Purchase information fetched successfully",
                status: "SUCCESS",
                data: results
            })
        }
    })
})

router.put("/editpurchase/:id", async (req, res) => {
    var balance = await getBalance(req.body.UserId);
    balance = balance.result;
    for(var i = 0; i < balance.length; i++){
        if(balance[i].GrantId == req.body.GrantId){
            balance = balance[i].balance
            break;
        }
    }
    if(balance - (req.body.Quantity * req.body.UnitCost) > 0){
        var query = `UPDATE PURCHASE SET ItemName = '${req.body.ItemName}', Quantity = '${req.body.Quantity}', Link = '${req.body.Link}', UnitCost = '${req.body.UnitCost}', TotalCost = '${req.body.Quantity * req.body.UnitCost}', Purchaser = '${req.body.Purchaser}', OrderDate = '${req.body.OrderDate}', DeliveryDate = '${req.body.DeliveryDate}', Status = '${req.body.Status}' WHERE PurchaseId = ${req.params.id}`;
        console.log(query);
        con.query(query, (err, result) => {
            if(err){
                console.log(err);
                res.status(500).json({
                    message: "There was an error updating the purchase details",
                    status: "FAILURE"
                })
            } else{
                res.status(200).json({
                    message: "The purchase details were successfully edited",
                    status: "SUCCESS"
                })
            }
        })
    }else {
        res.status(400).json({
            message: "Insufficient balance",
            status: "FAILURE"
        })
    }
})

router.put("/changeapprovalstatus/:purchaseId", (req, res) => {
    var query = `UPDATE PURCHASE SET ApprovalStatus = ${req.body.ApprovalStatus} WHERE PurchaseId = ${req.params.purchaseId}`;
    con.query(query, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).json({
                message: "There was an error updating the purchase details",
                status: "FAILURE"
            })
        } else {
            res.status(200).json({
                message: "The Purchase details were updated successfully",
                status: "SUCCESS"
            })
        }
    })
})

router.put("/changestatus/:purchaseId", (req, res) => {
    var query = `UPDATE PURCHASE SET Status = '${req.body.Status}', ApprovalStatus = 1 WHERE PurchaseId = ${req.params.purchaseId}`;
    con.query(query, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).json({
                message: "There was an error updating the purchase details",
                status: "FAILURE"
            })
        } else {
            res.status(200).json({
                message: "The Purchase details were updated successfully",
                status: "SUCCESS"
            })
        }
    })
})

router.delete("/deletepurchase/:purchaseId", (req, res) => {
    var query = `DELETE FROM PURCHASE WHERE PurchaseId = ${req.params.purchaseId}`;
    con.query(query, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).json({
                message: "There was an error deleting the required purchase",
                status: "FAILURE"
            })
        } else {
            res.status(200).json({
                message: "The purchase was deleted successfully",
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
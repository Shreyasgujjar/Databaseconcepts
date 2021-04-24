const express = require('express');
const router = express.Router();
var con = require('../metadata/config');

router.post("/", (req, res) => {
    var query = `INSERT INTO PURCHASE VALUES (NULL, '${req.body.ItemName}', '${req.body.Quantity}', '${req.body.Link}', '${req.body.UnitCost}', '${req.body.TotalCost}', '${req.body.Administrator}', '${req.body.Purchaser}', '${req.body.OrderDate}', '${req.body.DeliveryDate}', '${req.body.Status}', '${req.body.GrantId}'`;
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

router.put("/editpurchase", (req, res) => {
    var query = `UPDATE PURCHASE SET ItemName = '${req.body.ItemName}', Quantity = '${req.body.Quantity}', Link = '${req.body.Link}', UnitCost = '${req.body.UnitCost}', TotalCost = '${req.body.TotalCost}', Administrator = '${req.body.Administrator}', Purchaser = '${req.body.Purchaser}', OrderDate = '${req.body.OrderDate}', DeliveryDate = '${req.body.DeliveryDate}', Status = '${req.body.Status}' WHERE GrantId = ${req.body.GrantId}`;
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

module.exports = router;
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

router.get("/getspecific/:id", (req, res) => {
    var query = "SELECT * FROM PURCHASE WHERE HireId = " + req.params.id;
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

module.exports = router;
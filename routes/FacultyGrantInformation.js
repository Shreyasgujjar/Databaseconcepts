const express = require('express');
const router = express.Router();
var con = require('../metadata/config');

router.post("/", (req, res) => {
    var query = `INSERT INTO FACULTY_GRANT_INFORMATION VALUES (NULL, '${req.body.GrantFundingId}', '${req.body.GrantType}', '${req.body.GrantFrom}', '${req.body.GrantAmount}', '${req.body.GrantStartDate}', '${req.body.GrantEndDate}')`;
    con.query(query, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "There was a problem creating the grant information",
                status: 'FAILURE'
            })
        } else {
            // res.status(200).json({
            //     message: "Grant information created successfully",
            //     status: "SUCCESS"
            // })
            query = `INSERT INTO GRANT_DATA VALUES (${results.insertId}, ${req.body.UserId})`;
            con.query(query, (err, results, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        message: "There was a problem creating the mapping information",
                        status: 'FAILURE'
                    })
                } else {
                    res.status(200).json({
                        message: "Grant information created successfully",
                        status: "SUCCESS"
                    })
                }
            })
        }
    })
})

router.post("/assignment", (req, res) => {
    var query = `INSERT INTO GRANT_DATA VALUES (${req.body.grantId}, ${req.body.userId})`;
    con.query(query, (err, results, fields) => {
        if (err) {
            console.log(err.code);
            if(err.code == "ER_DUP_ENTRY"){
                res.status(400).json({
                    message: "This entry is already present in the DB",
                    status: 'FAILURE'
                })
            }else{
                res.status(500).json({
                    message: "There was a problem creating the mapping information",
                    status: 'FAILURE'
                })
            }
        } else {
            res.status(200).json({
                message: "Grant information mapping created successfully",
                status: "SUCCESS"
            })
        }
    })
})

router.get("/balance/:userid", async (req, res) => {
    var sumPurchase = await getPurchaseSum(req.params.userid);
    var hireSum = await getHireSum(req.params.userid);
    var paySum = await getPaySum(req.params.userid);
    var returnData = [];
    var query = `SELECT GrantId, GrantAmount FROM FACULTY_GRANT_INFORMATION WHERE GrantId IN (SELECT GrantId FROM GRANT_DATA WHERE UserId = ${req.params.userid})`;
    con.query(query, (err, result) => {
        if(err){
            res.status(400).json({
                message: "There was an error finding the balance",
                status: "ERROR"
            })
        }else {
            result.forEach(data => {
                returnData.push({"GrantId": data.GrantId, "Total": data.GrantAmount, "AmountSpent": 0});
            })
            for(var i = 0;i < hireSum.length;i++){
                for(var j = 0;j < returnData.length;j++){
                    if(returnData[j].GrantId == hireSum[i].GrantId){
                        returnData[j].AmountSpent += hireSum[i].total;
                        break;
                    }
                }
            }
            for(i = 0;i < sumPurchase.length;i++){
                for(j = 0;j < returnData.length;j++){
                    if(returnData[j].GrantId == sumPurchase[i].GrantId){
                        returnData[j].AmountSpent += sumPurchase[i].total;
                        break;
                    }
                }
            }
            for(i = 0;i < paySum.length;i++){
                for(j = 0;j < returnData.length;j++){
                    if(returnData[j].GrantId == paySum[i].GrantId){
                        returnData[j].AmountSpent += paySum[i].total;
                        break;
                    }
                }
            }
            for(i = 0;i < returnData.length;i++){
                returnData[i]["balance"] = returnData[i].Total - returnData[i].AmountSpent;
            }
            res.status(200).json({
                message: "data retrived successfully",
                status: "SUCCESS",
                result: returnData,
                breakDown: [{"PurchaseSum": sumPurchase, "paymentSum": paySum, "hireSum": hireSum}]
            })
        }
    })
})

router.get("/totalgrant/:userid", (req, res) => {
    var query = `SELECT SUM(GrantAmount) AS total FROM FACULTY_GRANT_INFORMATION WHERE GrantId IN (SELECT GrantId FROM GRANT_DATA WHERE UserId = ${req.params.userid})`;
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
                result: results
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

router.get("/getallinfo", (req, res) => {
    var query = `SELECT G.GrantId, G.UserId, F.GrantType, F.GrantFrom, F.GrantStartDate, F.GrantEndDate, U.FirstName, U.LastName, U.Address, U.CellPhone, U.Email FROM GRANT_DATA as G, FACULTY_GRANT_INFORMATION as F, USERS as U WHERE G.GrantId = F.GrantId AND G.UserId = U.UserId`;
    con.query(query, (err, results) => {
        if(err){
            res.status(500).json({
                message: "There was an error fetching the data",
                status: "ERROR"
            })
        } else {
            res.status(200).json({
                message: "Fetched all data successfully",
                status: "SUCCESS",
                data: results
            })
        }
    })
})

router.get("/getgrantsforuser/:userid", (req, res) => {
    var query = `SELECT * FROM FACULTY_GRANT_INFORMATION WHERE GrantId IN (SELECT GrantId FROM GRANT_DATA WHERE UserId = ${req.params.userid})`;
    con.query(query, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "There was a problem fetching the grant information",
                status: 'FAILURE',
                error: err
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

router.get("/search/:userid", (req, res) => {
    if(req.query.searchData == undefined){
        req.query.searchData = '';
    }
    var query = `SELECT * FROM FACULTY_GRANT_INFORMATION WHERE GrantId IN (SELECT GrantId FROM GRANT_DATA WHERE UserId = ${req.params.userid}) AND (GrantFundingId LIKE '%${req.query.searchData}%' OR GrantType LIKE '%${req.query.searchData}%' OR GrantFrom LIKE '%${req.query.searchData}%' OR GrantAmount LIKE '%${req.query.searchData}%')`;
    con.query(query, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "There was a problem fetching the grant information",
                status: 'FAILURE',
                error: err
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

router.put("/editgrant/:id", (req, res) => {
    var query = `UPDATE FACULTY_GRANT_INFORMATION SET GrantFundingId = '${req.body.GrantFundingId}', GrantType = '${req.body.GrantType}', GrantFrom = '${req.body.GrantFrom}', GrantAmount = '${req.body.GrantAmount}', GrantStartDate = '${req.body.GrantStartDate}', GrantEndDate = '${req.body.GrantEndDate}' WHERE GrantId = ${req.params.id}`;
    con.query(query, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "There was a problem updating the grant information",
                status: 'FAILURE'
            })
        } else {
            res.status(200).json({
                message: "Grant information updated successfully",
                status: "SUCCESS",
                data: results
            })
        }
    })
})

async function getPurchaseSum(userid){
    return new Promise((resolve, reject) => {
        var query = `SELECT SUM(TotalCost) AS total, GrantId FROM PURCHASE WHERE GrantId IN (SELECT GrantId FROM GRANT_DATA WHERE UserId = ${userid}) AND (ApprovalStatus = 1 OR ApprovalStatus = 2) GROUP BY GrantId`;
        con.query(query, (err, result)=> {
            resolve(result);
        })
    })
}

async function getHireSum(userid){
    return new Promise((resolve, reject) => {
        var query = `SELECT SUM(S.Salary) AS total, G.GrantId FROM STUDENT_HIRE_DATA AS S, GRANT_HIRE AS H, GRANT_DATA AS G WHERE S.HireId = H.HireId AND H.GrantId = G.GrantId AND G.UserId = ${userid} AND (S.Status = 1 OR S.Status = 2) GROUP BY G.GrantId`
        con.query(query, (err, result)=> {
            resolve(result);
        })
    })
}

async function getPaySum(userid){
    return new Promise((resolve, reject) => {
        var query = `SELECT SUM(P.PaymentAmount) AS total, G.GrantId FROM FACULTY_PAY AS P, GRANT_PAY AS G, GRANT_DATA AS D WHERE P.PaymentId = G.PaymentId AND G.GrantId = D.GrantId AND D.UserId = ${userid} GROUP BY G.GrantId`;
        con.query(query, (err, result) => {
            resolve(result);
        })
    })
}

async function getBalance(userid){
    return new Promise( async (resolve, reject) => {
        var sumPurchase = await getPurchaseSum(userid);
        var hireSum = await getHireSum(userid);
        var paySum = await getPaySum(userid);
        var returnData = [];
        var query = `SELECT GrantId, GrantAmount FROM FACULTY_GRANT_INFORMATION WHERE GrantId IN (SELECT GrantId FROM GRANT_DATA WHERE UserId = ${userid})`;
        con.query(query, (err, result) => {
            if(err){
                res.status(400).json({
                    message: "There was an error finding the balance",
                    status: "ERROR"
                })
            }else {
                result.forEach(data => {
                    returnData.push({"GrantId": data.GrantId, "Total": data.GrantAmount, "AmountSpent": 0});
                })
                for(var i = 0;i < hireSum.length;i++){
                    for(var j = 0;j < returnData.length;j++){
                        if(returnData[j].GrantId == hireSum[i].GrantId){
                            returnData[j].AmountSpent += hireSum[i].total;
                            break;
                        }
                    }
                }
                for(i = 0;i < sumPurchase.length;i++){
                    for(j = 0;j < returnData.length;j++){
                        if(returnData[j].GrantId == sumPurchase[i].GrantId){
                            returnData[j].AmountSpent += sumPurchase[i].total;
                            break;
                        }
                    }
                }
                for(i = 0;i < paySum.length;i++){
                    for(j = 0;j < returnData.length;j++){
                        if(returnData[j].GrantId == paySum[i].GrantId){
                            returnData[j].AmountSpent += paySum[i].total;
                            break;
                        }
                    }
                }
                for(i = 0;i < returnData.length;i++){
                    returnData[i]["balance"] = returnData[i].Total - returnData[i].AmountSpent;
                }
                resolve({
                    message: "data retrived successfully",
                    status: "SUCCESS",
                    result: returnData,
                    breakDown: [{"PurchaseSum": sumPurchase, "paymentSum": paySum, "hireSum": hireSum}]
                })
            }
        })
    })
}

module.exports = {
    router: router,
    getBalance: getBalance
}
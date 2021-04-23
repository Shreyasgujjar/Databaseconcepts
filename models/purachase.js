var con = require('../metadata/config')

function createPurchaseTable() {
    var query = "CREATE TABLE PURCHASE(" +
        "PurchaseId INT NOT NULL AUTO_INCREMENT PRIMARY KEY," +
        "ItemName VARCHAR(50) NOT NULL," +
        "Quantity INT NOT NULL," +
        "Link VARCHAR(100)," + 
        "UnitCost NUMERIC(8,2) NOT NULL," +
        "TotalCost NUMERIC(8,2) NOT NULL," +
        "Administrator VARCHAR(50) NOT NULL," +
        "Purchaser VARCHAR(50) NOT NULL," + 
        "OrderDate DATETIME NOT NULL," +
        "DeliveryDate DATETIME NOT NULL," +
        "Status TINYINT NOT NULL," +
        "GrantId INT NOT NULL," +
        "CONSTRAINT PURCHASE_GRANT_FK FOREIGN KEY(GrantId) REFERENCES FACULTY_GRANT_INFORMATION(GrantId) ON UPDATE CASCADE ON DELETE CASCADE)";

    con.query(query, function(err, result) {
        if (err) {
            console.log(err)
        }
    })
}

module.exports = {
    createPurchaseTable: createPurchaseTable,
};
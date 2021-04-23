var con = require('../metadata/config')

function createGrantPayTable() {
    var query = "CREATE TABLE GRANT_PAY(" +
        "GrantId INT  NOT NULL," +
        "PaymentId INT NOT NULL," +
        "CONSTRAINT PAY_GRANT_FK FOREIGN KEY(GrantId) REFERENCES FACULTY_GRANT_INFORMATION(GrantId) ON UPDATE CASCADE ON DELETE CASCADE," +
        "CONSTRAINT PAY_FK FOREIGN KEY(PaymentId) REFERENCES FACULTY_PAY(PaymentId) ON UPDATE CASCADE ON DELETE CASCADE," +
        "PRIMARY KEY (GrantId, PaymentId))";

    con.query(query, function(err, result) {
        if (err) {
            console.log(err)
        }
    })
}

module.exports = {
    createGrantPayTable: createGrantPayTable,
};
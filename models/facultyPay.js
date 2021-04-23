var con = require('../metadata/config')

function createFacultyPayTable() {
    var query = "CREATE TABLE FACULTY_PAY(" +
        "PaymentId INT NOT NULL AUTO_INCREMENT PRIMARY KEY," +
        "PaymentAmount NUMERIC(8,2) NOT NULL," +
        "PaymentDate DATETIME NOT NULL," +
        "Userid INT NOT NULL," + 
        "CONSTRAINT FACULTY_USER_FK FOREIGN KEY(UserId) REFERENCES USERS (UserId) ON UPDATE CASCADE ON DELETE CASCADE)";

    con.query(query, function(err, result) {
        if (err) {
            console.log(err)
        }
    })
}

module.exports = {
    createFacultyPayTable: createFacultyPayTable,
};
var con = require('../metadata/config')

function createFacultyGrantInformationTable() {
    var query = "CREATE TABLE FACULTY_GRANT_INFORMATION(" +
        "GrantId INT NOT NULL AUTO_INCREMENT PRIMARY KEY," +
        "GrantType VARCHAR(50) NOT NULL," +
        "GrantFrom VARCHAR(50) NOT NULL," +
        "GrantAmount NUMERIC(8,2) NOT NULL" +
        "GrantStartDate DATETIME NOT NULL," +
        "GrantEndDate DATETIME NOT NULL)";

    con.query(query, function(err, result) {
        if (err) {
            console.log(err)
        }
    })
}

module.exports = {
    createFacultyGrantInformationTable: createFacultyGrantInformationTable,
};
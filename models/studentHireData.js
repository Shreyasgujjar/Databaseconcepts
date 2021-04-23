var con = require('../metadata/config')

function createStudentHireTable() {
    var query = "CREATE TABLE STUDENT_HIRE_DATA(" +
        "HireId INT NOT NULL AUTO_INCREMENT PRIMARY KEY," +
        "FFirstName VARCHAR(50) NOT NULL," +
        "LastName VARCHAR(50)," +
        "UIN INT NOT NULL," +
        "Salary NUMERIC(8,2) NOT NULL," +
        "EmploymentType VARCHAR(50) NOT NULL," +
        "WorkLoad NUMERIC(2,1) NOT NULL," +
        "StartDate DATETIME NOT NULL," +
        "EndDate DATETIME NOT NULL)" ;

    con.query(query, function(err, result) {
        if (err) {
            console.log(err)
        }
    })
}

module.exports = {
    createStudentHireTable: createStudentHireTable,
};
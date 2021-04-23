var con = require('../metadata/config')

function createGrantHireTable() {
    var query = "CREATE TABLE GRANT_HIRE(" +
        "GrantId INT  NOT NULL," +
        "HireId INT NOT NULL," +
        "CONSTRAINT GRANT_FK FOREIGN KEY(GrantId) REFERENCES FACULTY_GRANT_INFORMATION(GrantId) ON UPDATE CASCADE ON DELETE CASCADE," +
        "CONSTRAINT HIRE_FK FOREIGN KEY(HireId) REFERENCES STUDENT_HIRE_DATA(HireId) ON UPDATE CASCADE ON DELETE CASCADE," + 
        "PRIMARY KEY (GrantId, HireId))"

    con.query(query, function(err, result) {
        if (err) {
            console.log(err)
        }
    })
}

module.exports = {
    createGrantHireTable: createGrantHireTable,
};
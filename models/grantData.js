var con = require('../metadata/config')

function createGrantDataTable() {
    var query = "CREATE TABLE GRANT_DATA(" +
        "GrantId INT  NOT NULL," +
        "UserId INT NOT NULL," +
        "CONSTRAINT GRANT_FK FOREIGN KEY(GrantId) REFERENCES FACULTY_GRANT_INFORMATION(GrantId) ON UPDATE CASCADE ON DELETE CASCADE," +
        "CONSTRAINT USER_FK FOREIGN KEY(UserId) REFERENCES USERS(UserId) ON UPDATE CASCADE ON DELETE CASCADE," +
        "PRIMARY KEY (GrantId, UserId))";

    con.query(query, function(err, result) {
        if (err) {
            console.log(err)
        }
    })
}

module.exports = {
    createGrantDataTable: createGrantDataTable,
};
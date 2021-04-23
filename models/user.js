var con = require('../metadata/config')

function createUserTable(){
        var query = "CREATE TABLE USERS ("+
                        "UserId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,"+
                        "FirstName VARCHAR(50) NOT NULL,"+
                        "LastName VARCHAR(50),"+ 
                        "Address VARCHAR(100) NOT NULL,"+ 
                        "OfficePhone VARCHAR(50) NOT NULL,"+
                        "CellPhone VARCHAR(12) NOT NULL,"+ 
                        "Email VARCHAR(100) NOT NULL,"+ 
                        "Password VARCHAR(100) NOT NULL,"+
                        "SuperUser TINYINT NOT NULL)";
            con.query(query, function(err, result) {
                if(err){
                    console.log(err)
                }
            })
}

module.exports = {
    createUserTable: createUserTable
};
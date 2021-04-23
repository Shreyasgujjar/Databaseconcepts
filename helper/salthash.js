const bcrypt = require("bcryptjs");

const saltRounds = 10

function genSalt(password) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) {
                reject(err)
            } else {
                bcrypt.hash(password, salt, function(err, hash) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(hash)
                    }
                })
            }
        })
    })
}

function validatePass(password, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, function(err, isMatch) {
            if (err) {
                resolve(false)
            } else if (!isMatch) {
                resolve(false)
            } else {
                resolve(true)
            }
        })
    })
}

module.exports = {
    genSalt: genSalt,
    validatePass: validatePass
}
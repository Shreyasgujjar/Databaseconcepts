var nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
        user: "mailsender1998@gmail.com",
        pass: "Cheeku@98",
    },
});

async function frgtpass(message, email) {
    var mailOptions = {
        from: 'mailsender1998@gmail.com',
        to: email,
        subject: 'Forgot password',
        text: message
    };
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
                resolve(false)
            } else {
                console.log('Email sent');
                resolve(true)
            }
        })

    })
}

module.exports = { frgtpass: frgtpass }
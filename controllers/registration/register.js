var userDetails = require('../../model/registration');
var otptoken = require('../../model/otpToken');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var otp_generator = require('otp-generator');
exports.registration = async function (req, res) {
    await userDetails.find({ email: req.body.email }).then(async (userInfo) => {
        if (userInfo.length > 0) {
            return res.status(400).json({
                error: "Email already exists"
            })
        } else {
            bcrypt.hash(req.body.password, 10, async (err, hash) => {
                if (err) {
                    return res.status(400).json({
                        error: err
                    })
                } else {
                    await userDetails.create({
                        email: req.body.email,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        phoneNumber: req.body.phoneNumber,
                        password: hash,
                        createdAt: Date.now()
                    }).then(data => {
                        res.status(200).json({
                            message: "User saved successfully",
                        });
                    });
                }
            });
        }
    });
}

exports.generateOTP = async function (req, res) {
    var email = req.query.email;
    await userDetails.findOne({ email: email }).then((userInfo) => {
        console.log(".............", email, userInfo)
        var otp = otp_generator.generate(5, { digits: true, alphabets: false, upperCase: false, specialChars: false });
        var smtpTransport = nodemailer.createTransport({
            service: "Gmail",
            host: 'smtp.gmail.com',
            auth: {
                user: "iswariyasankar95@gmail.com",
                pass: ""
            }
        });
        var mail = {
            from: "iswariya <iswariyasankar95@gmail.com>",
            to: email,
            subject: "Welcome",
            text: "Thanks for registering.Your OTP : " + otp
        }

        smtpTransport.sendMail(mail, function (error, res) {
            if (error) {
                console.log(error);
            } else {
                console.log("Message sent: " + mail.text);
            }
            smtpTransport.close();
        });
        var otptokenSchema = new otptoken({
            email: userInfo._id,
            otp: otp,
            isVerified: false
        })
        otptokenSchema.save().then(data => {
            res.json({
                email: email
            })
        });
    });

}

exports.verifyotp = async function (req, res) {
    var email = req.query.email.toLowerCase(),
        otp = req.body.otp;
    await userDetails.findOne({ email: req.query.email }).then(async userInfo => {
        await otptoken.findOne({ email: userInfo._id }).then(async data => {
            console.log("update successfully");
            if (data.otp == otp) {
                var update = { $set: { isVerified: true } }
                await otptoken.updateOne({ emailId: email }, update).then(result => {
                    return res.status(200).json({
                        message: 'verified successfully',
                        email: req.query.email
                    });
                }).catch(err => {
                    res.status(401).json({
                        message: err.message,
                        status: 401
                    });
                });
            }
            else {
                res.status(409).json({
                    message: 'Incorrect OTP',
                    status: 409
                });
            }
        }).catch(err => {
            res.status(401).json({
                message: err.message,
                status: 401
            });
        })

    })
}

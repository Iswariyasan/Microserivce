var register = require('../model/registration');
var otptoken = require('../model/otpToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var userDetails = require('../model/registration');

exports.login = async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    await register.findOne({ 'email': email })
        .then(async (data) => {
            bcrypt.compare(
                password, data.password,
                async (err, bcryptRes) => {
                    //if any error in bcryption 
                    if (err) {
                        return res.status(401).json({
                            message: 'password doesn\'t match',
                            error: err.message,
                            status: 401
                        });
                    }
                    if (bcryptRes == true) {
                        // axios.get(`http://localhost:3000/generateOtp?email=${email}`).then((response)=>{
                        //     console.log(',,,,,', response)    

                        // });    
                        var username = { email: email }
                        const token = jwt.sign(username, 'task', { expiresIn: '9h' });
                        await otptoken.findByIdAndUpdate(data._id, { $set: { token: token } }).then(otpData => {
                            return res.status(200).json({
                                message: 'Login successfull',
                                token: token,
                                status: 200
                            });
                        })
                    }
                    else if (bcryptRes == false) {
                        return res.status(401).json({
                            message: 'Wrong password please try again',
                            status: 401
                        });
                    }
                })
        })
        .catch((error) => {
            res.status(404).json({
                message: 'user not found',
                error: error.message
            });
        })

}

exports.passwordReset = async function (req, res) {
    try {
        jwt.verify(req.params.token, "task", async function (err, decoded) {
            if (err) {
                return res.status(500).json({
                    message: err.message,
                    status: 500
                });
            } else {
                bcrypt.hash(req.body.password, 10, async (err, hash) => {
                    if (err) {
                        return res.status(400).json({
                            error: err
                        })
                    } else {
                        await userDetails.updateOne({ email: decoded.email }, { $set: { password: hash } }).then(data => {
                            res.status(200).json({
                                message: "User saved successfully",
                            });
                        });
                    }
                });
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: 500
        });
    }
}
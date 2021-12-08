var register = require('../model/registration');
var otptoken = require('../model/otpToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config();
require('../db');
var express = require('express'),
    app = express(),
    port = process.env.PORT || 9000,
    cookieParser = require('cookie-parser');
app.use(cookieParser('message'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const axios = require('axios');
// CORS
app.use(function (req, res, next) {
    /* res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next(); */
    // 4200;
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    );

    // Request headers you wish to allow
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Use middleware to set the default Content-Type
app.use(function (req, res, next) {
    res.header('Content-Type', 'application/json');
    next();
});


app.post('/login', async (req, res) => {
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
                        var username = {email: email}
                        const token = jwt.sign(username, 'task', { expiresIn: '1800s' });
                        await otptoken.findByIdAndUpdate(data._id,{$set:{token: token}}).then(otpData=>{
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

});
app.listen(port);

console.log('Registration Form on live at:' + port);
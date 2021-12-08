var userDetails = require('../../model/registration');
var registerFn = require('./register');
require('../../db');
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    cookieParser = require('cookie-parser');
app.use(cookieParser('message'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// CORS
app.use(function(req, res, next) {
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
app.use(function(req, res, next) {
    res.header('Content-Type', 'application/json');
    next();
});

app.route('/registration').post(registerFn.registration);
app.route('/generateOtp').get(registerFn.generateOTP);
app.route('/verifyOtp').get(registerFn.verifyotp);

app.listen(port);
console.log('Registration Form on live at:' + port);
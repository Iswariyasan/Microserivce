var userDetails = require('./model/registration');
var registerFn = require('./controllers/register');
var taskDetails = require('./controllers/taskDetails');
var recycleBin = require('./controllers/recycleBin');
var nodemailer = require('nodemailer');
var login = require('./controllers/login');
const task = require('./model/task');
const cron = require('node-cron');
require('./db');
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    cookieParser = require('cookie-parser');
app.use(cookieParser('message'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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

app.route('/registration').post(registerFn.registration);
app.route('/generateOtp').get(registerFn.generateOTP);
app.route('/verifyOtp').get(registerFn.verifyotp);
app.route('/createTask/:token').post(taskDetails.saveTask);
app.route('/getTask/:token').get(taskDetails.retrieveTasks);
app.route('/restoreTask/:token/:taskNumber').put(recycleBin.updateRecycleTasks);
app.route('/getRecycleTask/:token').get(recycleBin.retrieveRecycleTasks);
app.route('/login').post(login.login);
app.route('/passwordReset/:token').put(login.passwordReset);
cron.schedule('* * * * *', async function () {
    console.log('running a task every minute');
    //maintain flag to set reminder 
    await task.find({ submittedDate: "2021-12-03" }).then(data => {
        const uniqueEmail = [...new Set(data.map(item => item.email))];
        console.log(uniqueEmail)
        var smtpTransport = nodemailer.createTransport({
            service: "Gmail",
            host: 'smtp.gmail.com',
            auth: {
                user: "iswariyasankar95@gmail.com",
                pass: "Ishusan@18"
            }
        });
        var mail = {
            from: "iswariya <iswariyasankar95@gmail.com>",
            to: uniqueEmail,
            subject: "Reminder",
            text: "Reminder for verify the task "
        }

        smtpTransport.sendMail(mail, function (error, res) {
            if (error) {
                console.log(error);
            } else {
                console.log("Message sent: " + mail.text);
            }
            smtpTransport.close();
        });
    }).catch(error => {
        console.log(error.message)
    })
});

app.listen(port);
console.log('Registration Form on live at:' + port);

//expiry date filter
//forgot password
//
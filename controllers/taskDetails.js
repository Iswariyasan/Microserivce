var taskDetails = require('../model/task');
var jwt = require('jsonwebtoken');

exports.saveTask = async function (req, res, next) {
    try {
        jwt.verify(req.params.token, "task", async function (err, decoded) {
            if (err) {
                return res.status(500).json({
                    message: err.message,
                    status: 500
                });
            } else {
                var taskData = {
                    taskNumber: req.body.taskNumber,
                    taskType: req.body.taskType,
                    taskStatus: req.body.taskStatus,
                    submittedDate: req.body.submittedDate,
                    expiryDate: req.body.expiryDate,
                    email: decoded.email,
                    createdAt: Date.now(),
                    isRemoved: false
                }
                await taskDetails.updateOne({ email: decoded.email, taskId: req.body.taskNumber }, { $set: taskData }, { upsert: true });
                return res.status(200).json({
                    message: "Task details saved successfully",
                    status: 200
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

exports.retrieveTasks = async function (req, res, next) {
    try {
        jwt.verify(req.params.token, "task", async function (err, decoded) {
            if (err) {
                return res.status(500).json({
                    message: err.message,
                    status: 500
                });
            } else {
                var userInfo = await taskDetails.find({ email: decoded.email, isRemoved: false });
                if (userInfo.length > 0) {
                    return res.status(200).json({
                        message: "Task Details",
                        taskList: userInfo,
                        status: 200
                    });

                } else {
                    return res.status(402).json({
                        message: "No task Found",
                        status: 402
                    });
                }
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: 500
        });
    }
}
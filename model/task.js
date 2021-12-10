const mongoose = require('mongoose');
const taskSchema = mongoose.Schema({
    taskId: {
        type: String,
        require: true
    },
    taskType:{
        type: String,
        require: true
    },
    taskStatus: {
        type: String,
        default: "Yet to start"
    },
    email: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    submittedDate: {
        type: String,
        require: true
    },
    expiryDate: {
        type: String,
        require: true
    },
    isRemoved: {
        type: Boolean,
        default: false
    }
})
const task = mongoose.model("taskDetails", taskSchema);

module.exports = task;
const mongoose = require('mongoose');
const otpSchema = mongoose.Schema({
    otp: {
       type: String,
       require: true
    },
    token: {
       type: String,
       require: true
    },
    email: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'register'
    },
    isVerified: {
        type: Boolean,
        default: false      
    }
})
const otp = mongoose.model("otpToken", otpSchema);

module.exports = otp;
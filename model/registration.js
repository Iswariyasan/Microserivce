const mongoose = require('mongoose');
const registrationSchema = mongoose.Schema({
    firstname: {
       type: String,
       require: true
    },
    lastname: {
       type: String,
       require: true
    },
    email: {
      type: String,
      require: true
    },
    password: {
       type: String,
       require: true
    },
    phoneNumber: {
       type: Number,
       require: true
    },    
    createdAt: {
        type: Date,
        require: true
     }

})
const registration = mongoose.model("register", registrationSchema);

module.exports = registration;
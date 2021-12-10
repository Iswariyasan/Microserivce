var taskDetails = require('../model/task');
var jwt = require('jsonwebtoken');
var userDetails = require('../model/registration');

exports.retrieveRecycleTasks = async function (req, res, next) {
    try {
        jwt.verify(req.params.token,"task",async function(err, decoded) {
            if(err){               
                return res.status(500).json({
                    message: err.message,
                    status: 500
                });                
            } else{
                var userInfo = await taskDetails.find({email : decoded.email, isRemoved: true});
                if(userInfo.length > 0){                                
                    return res.status(200).json({
                        message: "Task Details",
                        taskList: userInfo,
                        status: 200
                    });                     

                } else{                                 
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

exports.updateRecycleTasks = async function (req, res, next) {
    try {
        let taskId = req.params.taskNumber;
        jwt.verify(req.params.token,"task",async function(err, decoded) {
            if(err){               
                return res.status(500).json({
                    message: err.message,
                    status: 500
                });                
            } else{
                await taskDetails.updateMany({email : decoded.email,taskId: taskId},{$set:{ isRemoved: true}}).then( data=>{                                  
                return res.status(200).json({
                    message: "Updated successfully",
                    status: 200
                }); 
                }).catch((error) =>{               
                    return res.status(500).json({
                        message: error.message,
                        status: 500
                    }); 
                })                
            }
        });        
    } catch (error) {                  
        return res.status(500).json({
            message: error.message,
            status: 500
        });        
    }
}
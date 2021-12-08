var mongoose = require('mongoose');
mongoose.Promise = global.Promise; 
mongoose.connect(
    'mongodb://localhost/task',
    { useNewUrlParser: true }
).then(() => {
    console.log('Connection successful!');
}).catch((e) => {
    console.log('Connection failed!');
});
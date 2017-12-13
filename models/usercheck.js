//Connect to mongodb via mongoose
const mongoose = require('mongoose');

//Connect to MongoDB with mongoose
mongoose.connect('mongodb://admin:12345@127.0.0.1:27017');
let users = mongoose.model('users', { username: String , password: String });


//make module export
module.exports = users ;

//Connect to mongodb via mongoose
var mongoose = require('mongoose');

//Connect to MongoDB with mongoose
mongoose.connect('mongodb://admin:12345@127.0.0.1:27017');
var users = mongoose.model('users', { username: String , password: String });





//make module export
module.exports = users ;

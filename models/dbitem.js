//Connect to mongodb via mongoose
var mongoose = require('mongoose');

//Connect to MongoDB with mongoose
mongoose.connect('mongodb://admin:12345@127.0.0.1:27017');

//FindWarehouse model
var warehouse = mongoose.model('warehouse',{ category: String , type: String , name: String , company: String , price: String , stockPrice: String , item: String });

//make module export
module.exports = warehouse ;
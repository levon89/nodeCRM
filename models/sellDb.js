//Connect to mongodb via mongoose
const mongoose = require('mongoose');

//Connect to MongoDB with mongoose
mongoose.connect('mongodb://admin:12345@127.0.0.1:27017');

//FindWarehouse model
let solditems = mongoose.model('solditems',{
    category: String ,
    type: String ,
    name: String ,
    company: String ,
    price: Number ,
    stockPrice: Number ,
    soldPrice: Number,
    soldItem: Number,
    date: Date
});


//make module export
module.exports = solditems ;
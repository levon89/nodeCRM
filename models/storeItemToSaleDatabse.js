//Connect to mongodb via mongoose
var mongoose = require('mongoose');

//Connect to MongoDB with mongoose
mongoose.connect('mongodb://admin:12345@127.0.0.1:27017');

// grab the things we need
var sellDataSchema = mongoose.Schema;

// create a schema and show where documents
var sellDocSchema = new sellDataSchema ({
    category: String ,
    type: String ,
    name: String ,
    company: String ,
    price: Number ,
    stockPrice: Number ,
    soldPrice: Number,
    soldItem: Number,
    date : Number
},{
    collection:'solditems'
});

// the schema is useless so far
// we need to create a model using it
var sellStoredItem = mongoose.model('dataSellDocument', sellDocSchema);

// make this available to our users in our Node applications
module.exports = sellStoredItem;
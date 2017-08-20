//Connect to mongodb via mongoose
var mongoose = require('mongoose');

//Connect to MongoDB with mongoose
mongoose.connect('mongodb://admin:12345@127.0.0.1:27017');

// grab the things we need
var dataSchema = mongoose.Schema;

// create a schema and show where documents
var documentSchema = new dataSchema ({
    category: String ,
    type: String ,
    name: String ,
    company: String ,
    price: String ,
    stockPrice: String ,
    item: String
},{
    collection:'warehouses'
});

// the schema is useless so far
// we need to create a model using it
var storeditem = mongoose.model('dataDocument', documentSchema);

// make this available to our users in our Node applications
module.exports = storeditem;
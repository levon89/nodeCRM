//Express js required files
const express = require('express');
const app = express();
//GIve public  folder as stylesheet and other equipment serving folder after domain
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));
//PUG include
app.set('view engine', 'pug');
//Parse json with body parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//check module for users login
var users = require('./models/usercheck');
var cookieParser = require('cookie-parser');
app.use(cookieParser());
//Token gernator
const TokenGenerator = require('uuid-token-generator');
const tokgen = new TokenGenerator();
//Get and search database all item  or seaprate category (for option)module
var getDbItem = require('./models/dbitem');
//Module to add new item to database
var storeDocument = require('./models/storeItemToDatabase');



//Middleware to route to user main page when login check will be true
var userLogedmainPage = express.Router()
    .get('/main', function(req, res ,next) {
        res.render('index');
    });


//Middleware to get json format all  main database
var getMainDatabase = express.Router()
    .get('/main.json', function(req,res,next) {
        getDbItem.find( {} , function(err, getDbitem){
            if(err ||  !getDbitem){
               res.json(err);
            } else {
                res.json(JSON.stringify(getDbitem));
            }
        });
    });

//Get verified token to check if user is logged
var checkUser = express.Router()
    .post('/verify.json', function (req,res,next) {
         global.serverRealToken = req.body.tokenStr;
    });

//Middleware to route to sell if token will be true
var userHasChecked = express.Router()
    .get(function(req, res,next) {
        res.render('sell');
    });

//Open login first page
app.get('/login',function (req, res) {
    res.render('login');
});


//Get json from login form
app.post('/form', function(req, res){

    //Define username and password error to prompt user about wrong userrname and password
    var username = req.body.login;
    var password = req.body.password;

    //debugging output for the terminal
    console.log('you posted: Login: ' + username + ', Password: ' + password);

    //take mongoose exported module and use to check login and password
    users.findOne({ 'username': username , 'password': password}, function (err, users) {
        if (err || !users) {
            //send json to client to check if he logged
           res.json({
               success: false,
               message: 'Wrong username and/or password'
           });
        } else {

            //Generate token
            var newToken = tokgen.generate();
            //send json to client to check if user logged
            res.json({
                success: true,
                data: {
                    token: newToken
                }
            });
            //middle to main  page
            app.use(userLogedmainPage, getMainDatabase,checkUser);
            //error page redirect in every slash
            app.use(function (req, res, next) {
                res.status(404);
                var err = res.render('404');
                next(err);
            });
        }
    });
});

//Get json from main navbar header
app.post('/navbaroperation', function(req,res){
      //logOut logic
      var logout = req.body.isLoguot;
      if (logout == 'yesonline'){
          res.send(JSON.stringify({
              //this add server and send to client
              'isonline': 'yes',
              redirect: '/login'
          }));
      }else{
          //if client send wrong key value this will work
          res.json({
              'errorproblem': 'something went wrong with logout key value in server side'
          })
      }
});

//Show error if username or password will be wrong
app.get('/',function (req, res) {
   res.render('404')
});

//Send received json from client to server(to add new item)
app.post('/databaseadd.json', function (req,res) {
    var newitem = new storeDocument({
        category: req.body.category ,
        type: req.body.type ,
        name: req.body.name ,
        company: req.body.company ,
        price: req.body.price ,
        stockPrice: req.body.stockprice ,
        item: req.body.item
    });
    newitem.save(function(err) {
        if (err){
            res.json({
                'succcess':err
            })
        }else{
            res.json({
                'succcess':'Your item added'
            })
        }
    });
});

//Get all items which has value category and type for find modal option
app.post('/searchmodaljson.js',function (req,res) {
    getDbItem.find( {},'category type' , function(err, getItemsOption){
        if(err ||  !getItemsOption){
            res.json(err);
        } else {
            res.json(getItemsOption);
        }
    });
});

//Search items and return to client
app.post('/searchitem.json', function (req,res) {
    getDbItem.find({
        //Mongodb command to return all values , which will be match
        $or:[
            {
              //Mongodb value to combine category and type option (if one of these values will be empty, server response will be empty array )
              $and:[
                {category: req.body.searchcategory},
                {type: req.body.searchtype}
              ]
            },
            {name: req.body.searchname},
            {company: req.body.searchcompany},
            {price: req.body.searchprice},
            {stockPrice: req.body.searchstockprice},
            {item: req.body.searchitem}
        ]
    }, function (err, findedItems) {
        if(err ||  !findedItems){
            res.json(err);
        } else {
            //Response json to client , if all will be success
            res.json(findedItems);
        }
    });
});

//Update already excited item
app.post('/updateitem.json', function (req,res) {
    getDbItem.update({
            _id: req.body.updateIdItem
            },
            { $set:
                {
                    category: req.body.updateCategory,
                    type: req.body.updateType,
                    name: req.body.updateName,
                    company: req.body.updateCompany,
                    price: req.body.updatePrice,
                    stockPrice: req.body.updateStockprice,
                    item: req.body.updateItem
                }
            }
    ,function (err , updated) {
            if(err ||  !updated){
                res.json(err);
            } else {
                //Response json to client , if all will be success
                res.json('updated');
            }
        })
});

//Remove item by id
app.post('/removeItem.json', function (req,res) {
    getDbItem.findOneAndRemove({
        _id: req.body.removeIdItem
        },
        function (errDel , deleted) {
            if(errDel ||  !deleted){
                res.json(errDel);
            } else {
                //Response json to client , if all will be success
                res.json('Deleted');
            }
        }
    )
});

app.get('/sell', function (req,res) {
    res.render('sell');
    //Get client own token
    var clientToken = req.body.clientHanshake;
    //Check if real token is valid to client token
    if( clientToken = serverRealToken ){
        res.send({
            redirect:'/sell'
        })
    }else{

    }
});
//Console log string in shell
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});

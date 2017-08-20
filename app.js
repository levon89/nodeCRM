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
//JSON WEbTOKEN MODULE
var jwt = require('jsonwebtoken');
//Database item module
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
            var newToken = jwt.sign({
                username: tokgen
            }, 'Itwouldbedevastatingifanyonelearnedthatyourcharacteristhesiblingofanevilnematode.', {
                    expiresIn: '1h'
                }
            );

            //send json to client to check if user logged
            res.json({
                success: true,
                data: {
                    token: newToken
                }
            });
            //middle to main  page
            app.use(userLogedmainPage, getMainDatabase);
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

//Console log string in shell
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});

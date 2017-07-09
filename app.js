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

/*
//find all stored items and send to client
getDbItem.find( {} , function(err, getDbitem){
    if(err ||  !getDbitem){
        console.log(err);
    } else{
        res.send(JSON.stringify({
            //this add server and send to client
            'isonline': 'yes'
        }));
    }
});
*/




//Middleware to route to user main page when login check will be true
var userLogedmainPage = express.Router()
    .get('/main', function(req, res) {
        res.render('loginedpage');
    });




//Open login first page
app.get('/login',function (req, res) {
    res.render('index');
    //Turn of powered by header information(for secure)
    app.disable('x-powered-by');
});


//Get json from login form
app.post('/form', function(req, res){

    //Define username and password error to prompt user about wrong userrname and password
    var getUsername = req.body.login ;
    var getPassword = req.body.password;

    //debugging output for the terminal
    console.log('you posted: Login: ' + getUsername + ', Password: ' + getPassword);

    //take mongoose exported module and use to check login and password
    users.findOne({ 'username': req.body.login , 'password':req.body.password},function (err, users) {
        if (err || !users) {
            //send json to client to check if he logged
           res.send(JSON.stringify({
               'wrongUsername': req.body.login,
               'wrongPassword':req.body.password,
               //check in callback if user was Authicanted
               'Authorization': 'noAuth',
               //send redirect to client side
               redirect: '/'
           }));
        } else {
            //Generate token
            var newToken =jwt.sign({
                username: tokgen
            }, 'Itwouldbedevastatingifanyonelearnedthatyourcharacteristhesiblingofanevilnematode.' , { expiresIn: '4h' });
            //send json to client to check if user logged
            res.send(JSON.stringify({
                'username':req.body.login,
                'pass':req.body.password,
                //check in callback if user was Authicanted
                'Authorization': 'auth',
                //send redirect to client side
                redirect: '/main',
                token:newToken
            }));
            //middle to main  page
            app.use(userLogedmainPage);
            //error page redirect in every slash
            app.use(function (req, res, next) {
                res.status(404);
                var err =res.render('errorpage');
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
          res.send(JSON.stringify({
              'errorproblem': 'something went wrong with logout key value in server side'
          }))
      };
});

//Show error if username or password will be wrong
app.get('/',function (req, res) {
   res.render('errorpage')
});



//Console log string in shell
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});

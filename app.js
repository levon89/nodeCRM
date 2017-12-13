//Express js required files
const express = require('express');
const app = express();
//GIve public  folder as stylesheet and other equipment serving folder after domain
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));
//PUG include
app.set('view engine', 'pug');
//Parse json with body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//check module for users login
const users = require('./models/usercheck');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
//Token gernator
const TokenGenerator = require('uuid-token-generator');
const tokgen = new TokenGenerator();
//Get and search database all item  or seaprate category (for option)module
let getDbItem = require('./models/dbitem');
//CRUD sellitems collection
let sellDbMainItem = require('./models/sellDb');
//Module to add new item to database
let storeDocument = require('./models/storeItemToDatabase');
//Store item to sale database
let storeDocToSell = require('./models/storeItemToSaleDatabse');

//middleware to rend sell page
let sellMiddle = express.Router()
    .get('/sell',function (req,res,next) {
        res.render('sale');
        next();
    });

//middleware to rend total page
let totalMiddle = express.Router()
    .get('/total',function (req,res) {
        res.render('total');
    });

//Middleware to route to user main page when login check will be true
let userLogedmainPage = express.Router()
    .get('/main', function(req, res ,next) {
        res.render('index');
    });

//Middleware to get json format all  main database
let getMainDatabase = express.Router()
    .get('/main.json', function(req,res,next) {
        getDbItem.find( {} , function(err, getDbitem){
            if(err ||  !getDbitem){
               res.json(err);
            } else {
                res.json(JSON.stringify(getDbitem));
            }
        });
    });


//Middleware to get json for sell section dropdown
let getDbForSellDrop = express.Router()
    .get('/sellSecDrop.json', function(req,res,next) {
        getDbItem.find( {} , function(err, getDbitem){
            if(err ||  !getDbitem){
                res.json(err);
            } else {
                res.json(getDbitem);
            }
        });
    });


//Get verified token to check if user is logged
let checkUser = express.Router()
    .post('/verify.json', function (req,res,next) {
         global.serverRealToken = req.body.tokenStr;
    });


//Open login first page
app.get('/login',function (req, res) {
    res.render('login');
});


//Get json from login form
app.post('/form', function(req, res){

    //Define username and password error to prompt user about wrong userrname and password
    let username = req.body.login;
    let password = req.body.password;

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
            let newToken = tokgen.generate();
            //send json to client to check if user logged
            res.json({
                success: true,
                data: {
                    token: newToken
                }
            });
            //middle to main  page
            app.use(userLogedmainPage, getMainDatabase,checkUser);
            /*
            //error page redirect in every slash
            app.use(function (req, res, next) {
                res.status(404);
                res.render('404');
                next();
            });
            */
        }
    });
});

//Get json from main navbar header
app.post('/navbaroperation', function(req,res){
      //logOut logic
      let logout = req.body.isLoguot;
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
    let newitem = new storeDocument({
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

//Search items for sell section
app.post('/searchforsell.json', function (req,res) {
    getDbItem.find({
        //Mongodb command to return all values , which will be match
        $or:[
            {
                //Mongodb value to combine category and type option (if one of these values will be empty, server response will be empty array )
                $and:[
                    {category: req.body.findcategory},
                    {type: req.body.findtype}
                ]
            },
            {name: req.body.findname},
            {company: req.body.findcompany},
            {price: req.body.findprice},
            {stockPrice: req.body.findstockprice}
        ]
    }, function (err, searcheditems) {
        if(err ||  !searcheditems){
            res.json(err);
        } else {
            //Response json to client , if all will be success
            res.json(searcheditems);
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

//Sell selected item by id
app.post('/sellSelectedItem.json', function (req,res) {
    if(req.body.soldItemStockItem < req.body.soldItemLastCountReq ){
        res.json({
            'message': 'Error!!!! : You do not have enough item'
        })
    }else{
        //Find item from warehouse db by id and update
        getDbItem.findByIdAndUpdate(req.body.soldItemId,
            { $set: {
            //reduce our warehouse item total size , with client required item quanity
            item: req.body.soldItemStockItem - req.body.soldItemLastCountReq
        }
            },
            {
                new: true
            },
            function (err, updatedItem) {
                if (err) return handleError(err);
                //New item add
                let UTCDate = new Date();
                let newSellitem = new sellDbMainItem({
                    category: req.body.soldItemCategory ,
                    type: req.body.soldItemType ,
                    name: req.body.soldItemName ,
                    company: req.body.soldItemCompany ,
                    price: req.body.soldItemPrice ,
                    stockPrice: req.body.soldItemStockPrice ,
                    soldPrice: req.body.soldItemLastPriceReq,
                    soldItem: req.body.soldItemLastCountReq,
                    date:new Date(Date.UTC(UTCDate.getFullYear(), UTCDate.getMonth(), UTCDate.getDate(), 0,0,0))
                });
                newSellitem.save(function(err) {
                    if (err) {
                        res.json({
                            'err': err
                        })
                    } else {
                        res.json({
                            'message': 'Item was sold successfully'
                        })
                    }
                });
        });
    };
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

//Sell section render and logic
app.post('/sell.json', function (req,res) {
    //Get client own token
    let clientToken = req.body.clientHanshake;
    //Check if real token is valid to client token
    if(global.serverRealToken = clientToken){
        //Middleware to rend sale page
        app.use(sellMiddle,getDbForSellDrop);
        res.json({
            success: true
        });
    }else {
        console.log('no your token does not exist')
    }
});

//Warehouse section logic and render
app.post('/warehouse.json', function (req,res) {
    //Get client own token
    let clientToken = req.body.clientHanshake;
    //Check if real token is valid to client token
    if(global.serverRealToken = clientToken){
        //Middleware to rend sale page
        app.use(userLogedmainPage);
        res.json({
            success: true
        });
    }else {
        console.log('no, your token does not exist')
    }
});

//Total section logical and render
app.post('/total.json', function (req,res) {
    //Get client own token
    let clientTokenTotal = req.body.clientHanshaketotal;
    //Check if real token is valid to client token
    if(global.serverRealToken = clientTokenTotal){
        //Middleware to rend sale page
        app.use(totalMiddle);
        res.json({
            success: true
        });
    }else {
        console.log('no, your token does not exist')
    }
});

//Total date sell request send to client
app.post('/showdate.json', function (req,res) {
    let selectedDay = req.body.selectedDate;
    let nextSelectedDay = req.body.nextday;


    sellDbMainItem.find({

        date : {
            $gte: new Date(selectedDay),
            $lt: new Date(nextSelectedDay)
        }


    }, function (dateErr, findDate) {
        if(dateErr | !findDate){
            res.json(dateErr)
        }else{
            res.json(findDate)
        }
    });


});

//Console log string in shell
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});

    //Index table json controller(Index table child controller)
    app.controller('datagetcontroller', function ($scope,$http,$rootScope) {

        //Load every time when page load
        $scope.loadData = function () {
            //Ajax call to get server received json database
            $http({
                method: 'GET',
                url: '/main.json'
            }).then(function successCallback(response) {
                //Parse server answer database list from JSON
                var recievedList = JSON.parse(response.data);
                //Via ng repeat put received items in table($parent make child controller available inside Parent controller)
                $scope.$parent.itemsList = recievedList;
                //Every time use new received list for slice in parent pagination($parent make child controller available inside Parent controller)
                $scope.$parent.originalItemList = recievedList;
                //Take length of received database and use in pagination($parent make child controller available inside Parent controller)
                $scope.$parent.bigTotalItems=$scope.itemsList.length;
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };
        //HIGLIGHT TABLE ROW WHEN CLICK  via ng-click help
        $scope.highlight = function(items) {
            $scope.rowClicked = items;
            //Via  $rootscope make it bind with other controller , in form input
            $rootScope.itemCategory=items.category;
            $rootScope.itemType=items.type;
            $rootScope.itemName=items.name;
            $rootScope.itemCompany=items.company;
            $rootScope.itemPrice=items.price;
            $rootScope.itemStockprice=items.stockPrice;
            $rootScope.itemNumber=items.item;
        };
        $scope.rowClicked = null;
    });
    //Index table Parent controller
    app.controller('tablecontroller', function ($scope) {
        //UI BOOTSRAP total number of data , which contain pagination(in here values will be taken from above ($scope.$parent.bigTotalItems=$scope.itemsList.length;) , and number will not effect to paginate process )
        $scope.bigTotalItems = 7;
        //UI BOOTSRAP number of items in every pagiantion
        $scope.quanity = 10;
        //UI BOOTSRAP limit show number of paginate button (if noted button will be more that seven then it will add dots button)
        $scope.maxSize = 5;
        //UI BOOTSRAP in which page must be when first load page
        $scope.bigCurrentPage = 1;
        $scope.$watch('bigCurrentPage', function() {
            setPagingData($scope.bigCurrentPage);
        });
        function setPagingData(page) {
            $scope.bigCurrentPage = page;
            //Every time angular copy received data for slice , to make work paginate process well
            $scope.itemsList = $scope.originalItemList.slice((page - 1) * $scope.quanity, page * $scope.quanity);
        }
    });
    //Navbar logic
    app.controller('navigateControl' , function ($scope, $http) {

        //Navigate to sell section
        $scope.sell = function () {
            //Take client stored token
            var clientToken = window.localStorage.getItem('token');
            //ajax call to route to sell
            $http({
                method: 'post',
                url: '/sell.json',
                data: {
                    clientHanshake: clientToken
                }
            }).then(function sellRoute(data) {
                if(data.data.succcess = true){
                    window.location.href = '/sell'
                }
            }, function sellRouteError(data) {

            });
        };

        //NAvigate to total section
        $scope.total = function () {
            //Take client token
            var clientTokenTotal = window.localStorage.getItem('token');
            //ajax call to  call route
            $http({
                method: 'post',
                url: '/total.json',
                data: {
                    clientHanshaketotal: clientTokenTotal
                }
            }).then(function warehouseRoute(data) {
                if(data.data.succcess = true){
                    window.location.href = '/total'
                }
            }, function warehouseRouteError(data) {

            });
        };

        //logout process from navbar
        $scope.logout = function () {
            //ajax call to route
            $http({
                method: 'post',
                url: '/navbaroperation',
                data: {
                    //if is lohout value will be yesonline , then server will work
                    'isLoguot': 'yesonline',
                }
            }).then(function logoutData(data) {
                //Get ajax callback with some added data parameters
                if(data.data.isonline == 'yes'){
                    window.localStorage.removeItem("token");
                    window.location = data.data.redirect;
                } else{
                    //error problem with server side
                    alert(data.data.errorproblem)
                }
            }, function logOutErrorCallback(data) {
                alert('something wrong is going with ajax call')
            });
        }

    });
    //Index Form Controller
    app.controller('indexFormCtrl', function ($scope,$http) {
        $scope.addToDatabase = function () {
            //Ajax call to add new item database
            $http({
                method: 'post',
                url: '/databaseadd.json',
                data: {
                    'category': $scope.itemCategory,
                    'type': $scope.itemType,
                    'name': $scope.itemName,
                    'company': $scope.itemCompany,
                    'price': $scope.itemPrice,
                    'stockprice': $scope.itemStockprice,
                    'item': $scope.itemNumber
                }
            }).then(function recordedAnswer(response) {
                //alert about succes or error
                alert(response.data.succcess);
                //reload page after user prompt
                window.location.reload(true);
            }, function errorRecordAnswer(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }
    });
    //Get json from database for find modal option
    app.controller('modalFindItem', function ($scope,$http) {
        var vm = this;
        $scope.isVisibleUpdateButton= false;
       $scope.getItemsForFindModal = function () {
           $http({
               method : 'post',
               url : '/searchmodaljson.js',
           }).then(function successJsonResponse(response) {
               //Set response category into find option
               vm.categoryArray = response.data;
               //Set response type into find option
               vm.typeArray = response.data;
           }, function errorJsonResponse(response) {
               console.log(response)
           });
       };
       //Find what we need via modal
        $scope.searchItem = function () {
            //Animation scope near button show till response will not come
            $scope.loading = true;
            $http({
                method: 'post',
                url : '/searchitem.json',
                data : {
                    'searchcategory': $scope.ctrl.categoryArray.selectCat,
                    'searchtype': $scope.ctrl.typeArray.selectType,
                    'searchname': $scope.findName,
                    'searchcompany': $scope.findCompany,
                    'searchprice': $scope.findPrice,
                    'searchstockprice': $scope.findStockPrice,
                    'searchitem': $scope.findItem
                }
            }).then(function search(response) {
                var searchCount = response.data;
                //Aniamtion scope near button hide after response come
                $scope.loading = false;
                $scope.serverList = response.data;
                $scope.totalFindedItems = response.data.length;
                $scope.findedCurrentPage = 1;
                $scope.maxItemsInPage = 5;
                $scope.quanityForSearch = 10;
                $scope.$watch('findedCurrentPage', function() {
                    pagingData($scope.findedCurrentPage);
                });
                function pagingData(pages) {
                    $scope.findedCurrentPage = pages;
                    //Every time angular copy received data for slice , to make work paginate process well
                    $scope.serverList = searchCount.slice((pages - 1) * $scope.quanityForSearch, pages * $scope.quanityForSearch);
                }
                //Higlight table row from search table
                $scope.highlightFind = function(tableList) {
                    var selectedRow = tableList;
                    $scope.rowClicked = tableList;
                    $scope.isVisibleUpdateButton = true;
                    //Transfer value to editable form for update process
                    $scope.editItem = function () {
                        $scope.editId = selectedRow._id,
                        $scope.editCategory = selectedRow.category,
                        $scope.editType = selectedRow.type,
                        $scope.editName = selectedRow.name,
                        $scope.editCompany = selectedRow.company,
                        $scope.editPrice = selectedRow.price,
                        $scope.editStockPrice = selectedRow.stockPrice,
                        $scope.changeItem = selectedRow.item
                    };
                    //Remove item by id
                    $scope.removeItem = function () {
                        $http({
                            method: 'post',
                            url : '/removeItem.json',
                            data : {
                                'removeIdItem': selectedRow._id
                            }
                        }).then(function succesDelete(response) {
                            window.location.reload();
                            alert(response.data);
                        }, function errorUpdate(response) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                        });
                    }
                };
            }, function searchError (response) {

            })
        };
        //Update item
        $scope.updateItem = function () {
            $scope.updateProcess = true;
            $http({
                method: 'post',
                url : '/updateitem.json',
                data : {
                    'updateIdItem': $scope.editId,
                    'updateCategory': $scope.editCategory,
                    'updateType': $scope.editType,
                    'updateName': $scope.editName,
                    'updateCompany': $scope.editCompany,
                    'updatePrice': $scope.editPrice,
                    'updateStockprice': $scope.editStockPrice,
                    'updateItem': $scope.changeItem
                }
            }).then(function succesUpdate(response) {
                alert(response.data);
                $scope.updateProcess = false;
                window.location.reload();
            }, function errorUpdate(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };
    });






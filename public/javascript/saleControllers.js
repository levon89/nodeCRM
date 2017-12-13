
//Navigation controller
appForSell.controller('SellNavigateControl' , function ($scope, $http) {

    //Navigate to warehouse section
    $scope.warehouseClick = function () {
        //Take client stored token
        var clientToken = window.localStorage.getItem('token');
        //ajax call to route to sell
        $http({
            method: 'post',
            url: '/warehouse.json',
            data: {
                clientHanshake: clientToken
            }
        }).then(function warehouseRoute(data) {
            if(data.data.succcess = true){
                window.location.href = '/main'
            }
        }, function warehouseRouteError(data) {

        });
    };

    //Navigate to total section
    $scope.totalClick = function () {
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
    $scope.saleLogOut = function () {
        //ajax call to route
        $http({
            method: 'post',
            url: '/navbaroperation',
            data: {
                //if is lohout value will be yesonline , then server will work
                'isLoguot': 'yesonline',
            }
        }).then(function SelllogoutData(data) {
            //Get ajax callback with some added data parameters
            if(data.data.isonline == 'yes'){
                window.localStorage.removeItem("token");
                window.location = data.data.redirect;
            } else{
                //error problem with server side
                alert(data.data.errorproblem)
            }
        }, function SelllogOutErrorCallback(data) {
            alert('something wrong is going with ajax call')
        });
    }

});


//Sell controller for finder form and seller table
appForSell.controller('sellController' , function ($scope, $http) {
    var sellRes = this;
    //Load category and type into dropdown every time when page will be refresh
    $scope.loadSellDropdown = function () {
        $http({
            method: 'GET',
            url: '/sellSecDrop.json'
        }).then(function dropSuccess(response) {
            sellRes.recieveCategory = response.data;
            sellRes.recieveType = response.data;
        }, function dropError(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    };
    //Find item from warehouse and put in sell table
    $scope.findItemForsell = function () {
        $http({
            method: 'post',
            url: '/searchforsell.json',
            data: {
                'findcategory' : $scope.cont.recieveCategory.sellSelectCat,
                'findtype' : $scope.cont.recieveType.sellSelectType,
                'findname' : $scope.sellName,
                'findcompany' : $scope.sellComapny,
                'findprice' : $scope.sellPrice,
                'findstockprice' : $scope.sellStockPrice
            }
        }).then(function successSellSearch(response) {
            //If false do not shoe search empty paragraph result
            if(response.data.length==0){
                $scope.emptySearch = true;
            }else{
                $scope.emptySearch = false;
            }
            var searchCountSell = response.data;
            //pagiantion logic
            $scope.selltable = response.data;
            $scope.sellSectionTableItems = response.data.length;
            $scope.currPageSell = 1;
            $scope.maxItemsInSell = 5;
            $scope.quanitySell = 10;
            $scope.$watch('currPageSell', function() {
                pagingData($scope.currPageSell);
            });
            function pagingData(page) {
                $scope.currPageSell = page;
                //Every time angular copy received data for slice , to make work paginate process well
                $scope.selltable = searchCountSell.slice((page - 1) * $scope.quanitySell, page * $scope.quanitySell);
            };
            //Higlight table row from search table
            $scope.highlightSell = function(val) {
                $scope.rowClicked = val,
                //Add key value to already higlhighted row , because  other part we get from warehouse database
                val.soldItemLastPrice = undefined,
                val.soldItemLastCount = undefined
            };
        }, function errorSellSearch(response) {

        });
    };

    //Sell selected item
    $scope.sellItem = function () {
        $http({
            method: 'post',
            url: '/sellSelectedItem.json',
            data : {
                'soldItemId' : $scope.rowClicked._id,
                'soldItemCategory' : $scope.rowClicked.category,
                'soldItemType' : $scope.rowClicked.type,
                'soldItemName' : $scope.rowClicked.name,
                'soldItemCompany' : $scope.rowClicked.company,
                'soldItemPrice' : $scope.rowClicked.price,
                'soldItemStockPrice' : $scope.rowClicked.stockPrice,
                'soldItemStockItem' : $scope.rowClicked.item,
                'soldItemLastPriceReq' : $scope.rowClicked.soldItemLastPrice,
                'soldItemLastCountReq' : $scope.rowClicked.soldItemLastCount
            }
        }).then(function successCallback(response) {
            alert(response.data.message);
            window.location.reload()
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    }
});


//Total page navigation controller
appForTotal.controller('totalNAviController', function($scope, $http) {


    //Logout from bavi in total section
    $scope.totalLogOut=function () {
        //ajax call to route
        $http({
            method: 'post',
            url: '/navbaroperation',
            data: {
                //if is lohout value will be yesonline , then server will work
                'isLoguot': 'yesonline',
            }
        }).then(function(data) {
            //Get ajax callback with some added data parameters
            if(data.data.isonline == 'yes'){
                window.localStorage.removeItem("token");
                window.location = data.data.redirect;
            } else{
                //error problem with server side
                alert(data.data.errorproblem)
            }
        }, function(data) {
            alert('something wrong is going with ajax call')
        });
    }


    //Navigate to sell section
    $scope.totalSellClick = function () {
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

    //Naviagte to warehouse
    $scope.totalWarehouseClick = function () {
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
    }
});

//Total page  main page
appForTotal.controller('datePickCtrl', function ($scope,$http){

    //Begin date angular ui library
    $scope.today = function(){
        var SelectDt  = new Date();
        $scope.dt = new Date(Date.UTC(SelectDt.getFullYear(), SelectDt.getMonth(), SelectDt.getDate(), 0,0,0));
    };
    $scope.today();

    $scope.options = {
        customClass: getDayClass,
        minDate: null,
        showWeeks: true
    };
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date(tomorrow);
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [
        {
            date: tomorrow,
            status: 'full'
        },
        {
            date: afterTomorrow,
            status: 'partially'
        }
    ];

    function getDayClass(data) {
        var date = data.date;
            mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0,0,0,0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                    console.log($scope.events[i].status)
                }
            }
        }

        return '';
    }
    //End of angular-ui library
    
    //Show selected date data
    $scope.ShowDateSell = function () {
        var selectYourDate = $scope.dt;
        var theNextDay =  new Date(Date.UTC(selectYourDate.getFullYear(), selectYourDate.getMonth(), selectYourDate.getDate()+1, 0,0,0));
        $http({
            method: 'post',
            url: '/showdate.json',
            data: {
              'selectedDate'  : selectYourDate,
              'nextday' : theNextDay
            }
        }).then(function successCallback(response) {
            //If false do not shoe search empty paragraph result
            if(response.data.length==0){
                $scope.emptyTotal = true;
                $scope.amountrow = false;
            }else{
                $scope.emptyTotal = false;
                $scope.amountrow = true;
            }
            var searchCountTotal = response.data;
            //array var values for price
            var totalprice = 0;
            //array var values for stockprice
            var totalstockprice = 0;
            //array var values for lastsoldpirce
            var totalSoldPrice = 0;
            //find array value in objects and summarize values
            angular.forEach(searchCountTotal,function  (value) {
                //Prevent Nan result if object key soldprice does not exist
                if(value.soldPrice == null){
                    totalprice=totalprice+value.price,
                    totalstockprice=totalstockprice+value.stockPrice
                }else{
                    totalprice=totalprice+value.price,
                    totalstockprice=totalstockprice+value.stockPrice,
                    totalSoldPrice=totalSoldPrice+value.soldPrice
                }
            });
            //scope result to table totalprice <td>
            $scope.tableTotalPrice = totalprice;
            //scope result to table totalstockprice <td>
            $scope.tableTotalStockPrice = totalstockprice;
            //scope result to table totalselllastprice <td>
            $scope.tableTotalSellPrice = totalSoldPrice;
            $scope.dbSoldItems = response.data;
            $scope.totalItems = response.data.length;
            $scope.totalcurrPageSell = 1;
            $scope.maxItemsInTotal = 5;
            $scope.quanityTotal = 10;
            $scope.$watch('totalcurrPageSell', function() {
                pagingData($scope.totalcurrPageSell);
            });
            function pagingData(page) {
                $scope.totalcurrPageSell = page;
                //Every time angular copy received data for slice , to make work paginate process well
                $scope.dbSoldItems = searchCountTotal.slice((page - 1) * $scope.quanityTotal, page * $scope.quanityTotal);
            };
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    }


});

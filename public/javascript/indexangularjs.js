    //Index table json controller(Index table child controller)
    app.controller('datagetcontroller', function ($scope,$http) {
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
        $scope.rowClicked = null;
        $scope.highlight = function(items) {
            $scope.rowClicked = items;
        };
    });
    //Index table Parent controller
    app.controller('tablecontroller', function ($scope) {
        //UI BOOTSRAP number of items in every pagiantion
        $scope.quanity = 10;
        //UI BOOTSRAP limit show number of paginate button (if noted button will be more that seven then it will add dots button)
        $scope.maxSize = 7;
        //UI BOOTSRAP total number of data , which contain pagination(in here values will be taken from above ($scope.$parent.bigTotalItems=$scope.itemsList.length;) , and number will not effect to paginate process )
        $scope.bigTotalItems = 7;
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

    });








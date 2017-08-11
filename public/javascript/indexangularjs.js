
    app.controller('datagetcontroller', function ($scope,$http) {
        $scope.loadData = function () {
            $http({
                method: 'GET',
                url: '/main.json'
            }).then(function successCallback(response) {
                var recievedList = JSON.parse(response.data);
                $scope.itemsList = recievedList;
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };
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
                //Get ajax callback with some added data parameters ('isonline'== 'yes')
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








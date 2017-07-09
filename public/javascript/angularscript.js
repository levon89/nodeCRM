app.controller('validateCtrl', function($scope, $http) {
    // Limit user to add number or similiar characters , only alphabet
    $scope.numOnlyRegex = /^[a-zA-Z]*$/;
    // Ajax call when user click in login form button
    $scope.loginsend = function() {
        $http({
            method: 'post',
            url: '/form',
            data: {
                'login': $scope.uName,
                'password': $scope.uPass
            }
        }).then(function successCallback(data) {
            //If CAllback has wrongPassword or wrongUsername parametrs then make other function
            if(data.data.wrongPassword || data.data.wrongUsername){
                //If one parametr has noAuth value then redirect to 404 page
                if (data.data.Authorization === "noAuth") {
                    //check if token exist delete
                    window.localStorage.removeItem("connect");
                    window.location = data.data.redirect
                }
               //If callback has pass or username parametr then go inside function
            } else if(data.data.pass || data.data.username){
                //if ajax callback has auth vaule then use callback redirect to refresh window
                if (data.data.Authorization === "auth") {
                    //add token info to client pc
                    window.localStorage.setItem("connect",data.data.token);
                    window.location = data.data.redirect;
                }
            }
        }, function errorCallback(data) {
            //Ajax call problems alert
            alert('Something wrong with ajax')
        });
    };
});

//Navbar logic
navi.controller('navigateControl' , function ($scope, $http) {
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
              window.localStorage.removeItem("connect");
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

//get db after user load controller
getDb.controller('getdbitems' , function ($scope, $http) {
    $http({
        method: 'GET',
        url: '/main',
        data: {
            'mama': 'he'
        }
    }).then(function successCallback(response) {
        console.log(response)
    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });
});
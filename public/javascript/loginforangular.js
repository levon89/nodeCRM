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
        }).then(function successCallback(response) {
            //If CAllback has wrongPassword or wrongUsername parametrs then make other function
            if(!response.data.success){
                // redirect to 404 page

                console.log(response.data.message);

                window.localStorage.removeItem("token");
                window.location = '/';

               //If callback has pass or username parametr then go inside function
            } else {
                //if ajax callback has auth vaule then use callback redirect to refresh window
                //add token info to client pc
                window.localStorage.setItem("token", response.data.token);
                window.location.href='/main';
            }
        }, function errorCallback(data) {
            //Ajax call problems alert
            alert('Something wrong with ajax')
        });
    };
});
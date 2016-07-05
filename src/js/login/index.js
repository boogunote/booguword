'use strict';

angular.module('bn.login', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'js/login/index.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', '$state', 'BnCommon', '$cookies',
    function($scope, $state, BnCommon, $cookies) {

  $scope.username = $cookies.get('username');
  $scope.password = $cookies.get('password');

  $scope.login = function() {

    if ($scope.isSaveUsername) $cookies.put('username', $scope.username);
    if ($scope.isSavePassword) $cookies.put('password', $scope.password);
    
    BnCommon.ref.authWithPassword({
        email: $scope.username,
        password: $scope.password
    }, function(error, authData) {
      if (error) {
        switch (error.code) {
          case "INVALID_EMAIL":
            console.log("The specified user account email is invalid.");
            break;
          default:
            console.log("Error logging user in:", error);
        }
      } else {
        console.log("Authenticated successfully with payload:", authData);
        $state.go('main');
      }
    });
    
  }
}]);
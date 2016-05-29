'use strict';

angular.module('bnw.login', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'js/login/index.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', '$state', 'BnwCommon', function($scope, $state, BnwCommon) {

  $scope.login = function() {
    
    BnwCommon.ref.authWithPassword({
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
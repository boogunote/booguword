'use strict';

angular.module('bnw.login', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'login/index.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', '$state', function($scope, $state) {

  $scope.login = function() {
    console.log($scope)
    $state.go('main');
  }
}]);
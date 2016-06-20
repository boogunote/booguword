'use strict';

angular.module('bn.main', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main', {
    url: '/main',
    templateUrl: 'js/main/index.html',
    controller: 'MainCtrl'
  });
}])

.controller('MainCtrl', ['$scope', '$state', '$http', 'BnCommon', function($scope, $state, $http, BnCommon) {
  var ref = BnCommon.ref;

  if (!ref.getAuth()) {
    $state.go('login');
    return;
  }

  ref.onAuth(function(authData) {
    if (!authData) $state.go('login');
  });
  
  $scope.logout = function() {
    ref.unauth();
  }

}]);
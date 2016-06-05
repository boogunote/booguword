'use strict';

angular.module('bn.trans', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('trans', {
    url: '/trans',
    templateUrl: 'js/trans/index.html',
    controller: 'TransCtrl'
  });
}])

.controller('TransCtrl', ['$scope', '$state', '$http', 'BnCommon', function($scope, $state, $http, BnCommon) {
  var ref = BnCommon.ref;

  if (!ref.getAuth()) {
    $state.go('login');
    return;
  }

  ref.onAuth(function(authData) {
    if (!authData) $state.go('login');
  });
  
  function init() {
    BnCommon.getRef()
    .once("value", function(snapshot) {
      var data = snapshot.val();
      for (var key in data) {
        data[key].type = 'word';
      }
      $scope.data = data;
      $scope.safeApply(function() {
        $scope.dataStr = JSON.stringify(data, null, 2);
      })
    })
  }

  $scope.go = function() {
    BnCommon.getRef().set($scope.data)
  }

  init();

}]);
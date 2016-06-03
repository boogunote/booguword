'use strict';

angular.module('bnw.trans', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('trans', {
    url: '/trans',
    templateUrl: 'js/trans/index.html',
    controller: 'TransCtrl'
  });
}])

.controller('TransCtrl', ['$scope', '$state', '$http', 'BnwCommon', function($scope, $state, $http, BnwCommon) {
  var ref = BnwCommon.ref;

  if (!ref.getAuth()) {
    $state.go('login');
    return;
  }

  ref.onAuth(function(authData) {
    if (!authData) $state.go('login');
  });
  
  function init() {
    BnwCommon.getRef()
    .once("value", function(snapshot) {
      var data = snapshot.val();
      for (var key in data) {
        var value = data[key];
        data[key] = {
          'value': value,
          'meta': {
            'type': 'word'
          }
        }
      }
      $scope.safeApply(function() {
        $scope.dataStr = JSON.stringify(data, null, 2);
      })
    })
  }

  init();

}]);
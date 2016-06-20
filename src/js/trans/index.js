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
    .orderByChild('type')
    .equalTo('word')
    .once("value", function(snapshot) {
      var data = snapshot.val();
      for (var key in data) {
        var newData = {
          sentence: !!data[key].sentence?data[key].sentence:'',
          timestamp: data[key].timestamp,
          title: !!data[key].title?data[key].title:'',
          type: 'sentence',
          url: !!data[key].url?data[key].url:'',
          wordList: [{
            comment: (!!data[key].strpho?data[key].strpho:'') + ' ' + (!!data[key].mytrans?data[key].mytrans:'') + ' ' + (!!data[key].basetrans?data[key].basetrans:'') + ' ' + (!!data[key].usertrans?data[key].usertrans:''),
            word: data[key].word
          }]
        }
        data[key] = newData;
      }
      $scope.data = data;
      $scope.safeApply(function() {
        $scope.dataStr = JSON.stringify(data, null, 2);
      })
    }, function(result) {
      console.log(result)
    })
  }

  $scope.go = function() {
    for(var key in $scope.data) {
      BnCommon.getRef().child(key).set($scope.data[key])
    }
  }

  init();

}]);
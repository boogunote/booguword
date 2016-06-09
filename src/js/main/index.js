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
  
  function init() {
    $scope.pageIndex = 0;
    $scope.pageSize = 20;

    loadLatestData(function() {
      BnCommon.getRef().on("child_added", update);
      BnCommon.getRef().on("child_changed", update);
      BnCommon.getRef().on("child_removed", update);
    });
  }

  function onData(snapshot) {
    var itemList = [];
    snapshot.forEach(function(data) {
      var item = data.val();
      item.key = data.key();
      itemList.push(item);
    });
    if (itemList.length <= 0) return;
    $scope.startAt = itemList[0].timestamp;
    $scope.endAt = itemList[itemList.length-1].timestamp;
    $scope.endAtDate = new Date($scope.endAt);
    itemList.reverse();
    $scope.safeApply(function() {
      $scope.itemList = itemList;
    });
  }

  function loadLatestData(cb) {
    BnCommon.getRef()
        .orderByChild("timestamp")
        .limitToLast($scope.pageSize)
        .once("value", function(snapshot) {
      onData(snapshot);
      $scope.safeApply(function() {
        if (!$scope.itemList && $scope.itemList.length <= 0) return;
        $scope.latestTimestamp = $scope.itemList[0].timestamp;
      })

      if (!!cb) cb();
    })
  }

  function update() {
    if (!!$scope.itemList &&
          $scope.itemList.length > 0 &&
          $scope.latestTimestamp == $scope.itemList[0].timestamp)
      loadLatestData();
  }

  $scope.nextPage = function() {
    if ($scope.pageSize != $scope.itemList.length) return;
    BnCommon.getRef()
        .orderByChild("timestamp")
        .endAt($scope.startAt-1) // NOTICE: display item is reversed
        .limitToLast($scope.pageSize)
        .once("value", onData)
  }

  $scope.prevPage = function() {
    BnCommon.getRef()
        .orderByChild("timestamp")
        .startAt($scope.endAt+1) // NOTICE: display item is reversed
        .limitToFirst($scope.pageSize)
        .once("value",  function(snapshot) {
      onData(snapshot);
      if ($scope.itemList.length != $scope.pageSize) loadLatestData();
    })
  }

  $scope.goToDate = function() {
    $scope.endAtDate.setHours(23,59,59,999);
    $scope.endAt = $scope.endAtDate.getTime();
    BnCommon.getRef()
        .orderByChild("timestamp")
        .endAt($scope.endAt) // NOTICE: display item is reversed
        .limitToLast($scope.pageSize)
        .once("value", onData)
  }

  $scope.logout = function() {
    ref.unauth();
  }

  init();

}]);
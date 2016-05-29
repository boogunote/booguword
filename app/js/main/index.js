'use strict';

angular.module('bnw.main', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main', {
    url: '/main',
    templateUrl: 'js/main/index.html',
    controller: 'MainCtrl'
  });
}])

.controller('MainCtrl', ['$scope', '$state', 'BnwCommon', function($scope, $state, BnwCommon) {
  var ref = BnwCommon.ref;
  
  function init() {
    $scope.pageIndex = 0;
    $scope.pageSize = 20;

    $scope.newWord = {};

    BnwCommon.getRef().on("child_added", update);
    BnwCommon.getRef().on("child_changed", update);
    BnwCommon.getRef().on("child_removed", update);

    loadLatestData();
  }

  function onData(snapshot) {
    var itemList = [];
    snapshot.forEach(function(data) {
      // console.log("The " + data.key() + " dinosaur's score is " + data.val());
      var item = data.val();
      item.key = data.key();
      item.createDate = new Date(item.timestamp).toLocaleString();
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

  function loadLatestData() {
    BnwCommon.getRef()
        .orderByChild("timestamp")
        .limitToLast($scope.pageSize)
        .once("value", function(snapshot) {
      onData(snapshot);
      $scope.safeApply(function() {
        $scope.latestTimestamp = $scope.itemList[0].timestamp;
      })
    })
  }

  function update() {
    if (!!$scope.itemList &&
          $scope.itemList.length > 0 &&
          $scope.latestTimestamp == $scope.itemList[0].timestamp)
      loadLatestData();
  }


  $scope.addWord = function() {
    $scope.newWord.timestamp = Wilddog.ServerValue.TIMESTAMP;
    BnwCommon.getRef()
      .push($scope.newWord)
  }

  $scope.deleteWord = function(item) {
    if (window.confirm("删除 '" + item.word + "' ？")) {
      BnwCommon.getRef().child(item.key).remove(function () {
      })
    }
  }

  $scope.editWord = function(item) {
    if (!item.word) return;

    var newWord = {
      word: item.word,
      strpho: !!item.strpho ? item.strpho : '',
      usertrans: !!item.usertrans ? item.usertrans : '',
      basetrans: !!item.basetrans ? item.basetrans : '',
      sentence: !!item.sentence ? item.sentence : '',
      url: !!item.url ? item.url : '',
      title: !!item.title ? item.title : '',
      timestamp: !!item.timestamp ? item.timestamp : ''
    }
    BnwCommon.getRef().child(item.key).set(newWord);
    item.edit = false;
  }

  $scope.nextPage = function() {
    if ($scope.pageSize != $scope.itemList.length) return;
    BnwCommon.getRef()
        .orderByChild("timestamp")
        .endAt($scope.startAt-1) // NOTICE: display item is reversed
        .limitToLast($scope.pageSize)
        .once("value", onData)
  }

  $scope.prevPage = function() {
    BnwCommon.getRef()
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
    BnwCommon.getRef()
        .orderByChild("timestamp")
        .endAt($scope.endAt) // NOTICE: display item is reversed
        .limitToLast($scope.pageSize)
        .once("value", onData)
  }

  init();

}]);
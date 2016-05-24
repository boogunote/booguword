'use strict';

angular.module('bnw.main', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main', {
    url: '/main',
    templateUrl: 'main/index.html',
    controller: 'MainCtrl'
  });
}])

.controller('MainCtrl', ['$scope', '$state', 'BnwCommon', function($scope, $state, BnwCommon) {
  var ref = BnwCommon.ref;
  
  function init() {
    $scope.pageIndex = 0;
    $scope.pageSize = 20;

    $scope.newWord = {};

    ref.child(ref.getAuth().uid).on("child_added", update);
    ref.child(ref.getAuth().uid).on("child_changed", update);
    ref.child(ref.getAuth().uid).on("child_removed", update);

    loadData();
  }

  function loadData() {
    ref.child(ref.getAuth().uid)
        .orderByChild("timestamp")
        .limitToLast($scope.pageSize * ($scope.pageIndex+1))
        .once("value", function(snapshot) {
      var itemList = [];
      snapshot.forEach(function(data) {
        // console.log("The " + data.key() + " dinosaur's score is " + data.val());
        var item = data.val();
        item.key = data.key();
        item.createDate = new Date(item.timestamp).toLocaleString();
        itemList.push(item);
      });
      itemList.reverse();
      $scope.safeApply(function() {
        $scope.itemList = itemList;
      });
    })
  }

  function update() {
    loadData();
  }


  $scope.addWord = function() {
    $scope.newWord.timestamp = new Date().getTime();
    ref.child(ref.getAuth().uid)
      .push($scope.newWord)
  }

  $scope.deleteWord = function(item) {
    if (window.confirm("删除 '" + item.word + "' ？")) {
      ref.child(ref.getAuth().uid).child(item.key).remove(function () {
      })
    }
  }

  init();

}]);
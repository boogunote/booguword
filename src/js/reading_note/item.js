'use strict';

angular.module('bn.reading_note.item', ['bn.common'])

.directive('bnReadingNoteItem', ['BnCommon', function(BnCommon) {
  return {
    scope: {
      data: '=ngModel',
    },
    templateUrl: 'js/reading_note/item.html',
    controller: 'BnReadingNoteItemCtrl'
  };
}])

.controller('BnReadingNoteItemCtrl', ['$scope', 'BnCommon', '$timeout','$rootScope',
    function($scope, BnCommon, $timeout, $rootScope) {

  $scope.editTitle = false;
  $scope.showUrl = false
  $scope.modified = false;
  $scope.showContent = true;
  
  function init() {
    $scope.createDate = new Date($scope.data.timestamp).toLocaleString();
  }

  $scope.delete = function() {

    if (window.confirm("删除 '" + $scope.data.title +"' ?")) {
      BnCommon.getRef('reading_note').child($scope.data.key).remove(function () {
      })
    }
  }

  $scope.$on('data.note', function() {
    $scope.modified = true;
  })

  $scope.onKeyDown = function(evt) {

    if (!!$scope.timeoutHandler) $timeout.cancel($scope.timeoutHandler);
    $scope.timeoutHandler = $timeout(function() {
      $scope.timeoutHandler = null;
      $scope.save();
    }, 3*1000)

    if (evt.ctrlKey && 83 == evt.keyCode) {
      $scope.save();
      evt.preventDefault();
    }
  }

  $scope.save = function() {

    $scope.$emit('shutdown-message');

    delete $scope.data.$$hashKey;
    BnCommon.getRef('reading_note').child($scope.data.key).set($scope.data, function() {
      $rootScope.safeApply(function() {
        $scope.modified = false;
      })
      $scope.$emit('open-message');
    });
  }

  init();
}]);
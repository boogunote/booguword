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

.controller('BnReadingNoteItemCtrl', ['$scope', 'BnCommon', '$timeout',
    function($scope, BnCommon, $timeout) {

  $scope.editTitle = false;
  $scope.showUrl = false
  $scope.modified = false;
  $scope.showContent = true;
  
  function init() {
    $scope.createDate = new Date($scope.data.timestamp).toLocaleString();
  }

  $scope.delete = function() {

    if (window.confirm("删除 '" + $scope.data.title +"' ?")) {
      $scope.$emit('shutdown-message');
      BnCommon.getRef('reading_note').child($scope.data.key).remove(function () {
        $scope.$emit('open-message');
      })
    }
  }

  $scope.$on('data.note', function() {
    $scope.modified = true;
  })

  $scope.onKeyDown = function(evt) {
    if (evt.ctrlKey && 83 == evt.keyCode) {
      $scope.save();
      evt.preventDefault();
    }
  }

  $scope.save = function() {

    $scope.$emit('shutdown-message');

    delete $scope.data.$$hashKey;
    BnCommon.getRef('reading_note').child($scope.data.key).set($scope.data, function() {
      $scope.modified = false;
      $scope.$emit('open-message');
    });
  }

  init();
}]);
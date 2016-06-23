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

.controller('BnReadingNoteItemCtrl', ['$scope', 'BnCommon', function($scope, BnCommon) {

  $scope.edit = false;

  $scope.modified = false;
  
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
    if (evt.ctrlKey && 83 == evt.keyCode) {
      $scope.save();
      evt.preventDefault();
    }
  }

  $scope.save = function() {

    delete $scope.data.$$hashKey;
    BnCommon.getRef('reading_note').child($scope.data.key).set($scope.data, function() {
      $scope.modified = false;
    });
  }

  init();
}]);
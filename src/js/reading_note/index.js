'use strict';

angular.module('bn.reading_note', [
  'bn.common',
  'bn.reading_note.item'
])

.directive('bnReadingNote', ['BnCommon', function(BnCommon) {
  return {
    templateUrl: 'js/reading_note/index.html',
    controller: 'BnReadingNoteCtrl'
  };
}])

.controller('BnReadingNoteCtrl', ['$scope', 'BnCommon', '$http', function($scope, BnCommon, $http) {
  BnCommon.initScope($scope, 'reading_note');

  $scope.init();

  $scope.newNote = function() {
    BnCommon.getRef('reading_note').push({
      note: '',
      title: '',
      url: '',
      editTitle: true,
      timestamp: Wilddog.ServerValue.TIMESTAMP
    });
  }
}])
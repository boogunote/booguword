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

.controller('BnReadingNoteCtrl', ['$scope', 'BnCommon', '$http', '$timeout', '$rootScope',
    function($scope, BnCommon, $http, $timeout, $rootScope) {

  $scope.openAll = false;
  
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

  $timeout(function() {
    $rootScope.$broadcast('elastic:adjust');
  }, 200);

}])
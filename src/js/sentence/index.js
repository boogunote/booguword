'use strict';

angular.module('bn.sentence', [
  'bn.common',
  'bn.sentence.item',
  'bn.sentence.new'
])

.directive('bnSentence', ['BnCommon', function(BnCommon) {
  return {
    templateUrl: 'js/sentence/index.html',
    controller: 'BnSentenceCtrl'
  };
}])

.controller('BnSentenceCtrl', ['$scope', 'BnCommon', '$http', function($scope, BnCommon, $http) {
  BnCommon.initScope($scope, 'bnword');

  $scope.init();
}])
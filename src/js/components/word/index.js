'use strict';

angular.module('bn.components.word',
    ['bn.common'])

.directive('bnWordDirective', ['BnCommon', function(BnCommon) {
  return {
    scope: {
      data: '=ngModel',
    },
    templateUrl: 'js/components/word/index.html',
    controller: 'BnWordCtrl'
  };
}])

.controller('BnWordCtrl', ['$scope', 'BnCommon', function($scope, BnCommon) {

  $scope.edit = false;
  $scope.showRef = false;
  $scope.showDict = false;
  $scope.dictUrl = 'http://dict.cn/' + $scope.data.word;
  
  function init() {
    if (!!$scope.data.sentence) {
      $scope.sentenceHtml = $scope.data.sentence.replace($scope.data.word, '<span class="highlight-word">'+ $scope.data.word +'</span>')
    }
    $scope.createDate = new Date($scope.data.timestamp).toLocaleString();
  }

  $scope.delete = function() {
    if (window.confirm("删除 '" + $scope.data.word + "' ？")) {
      BnCommon.getRef().child($scope.data.key).remove(function () {
      })
    }
  }

  $scope.update = function() {
    if (!$scope.data.word) return;

    var newWord = {
      word: $scope.data.word,
      strpho: !!$scope.data.strpho ? $scope.data.strpho : '',
      usertrans: !!$scope.data.usertrans ? $scope.data.usertrans : '',
      basetrans: !!$scope.data.basetrans ? $scope.data.basetrans : '',
      sentence: !!$scope.data.sentence ? $scope.data.sentence : '',
      url: !!$scope.data.url ? $scope.data.url : '',
      title: !!$scope.data.title ? $scope.data.title : '',
      type: 'word',
      timestamp: $scope.data.timestamp
    }
    BnCommon.getRef().child($scope.data.key).set(newWord);
    $scope.edit = false;
  }

  init();
}]);
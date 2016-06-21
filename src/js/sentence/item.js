'use strict';

angular.module('bn.sentence.item', ['bn.common'])

.directive('bnSentenceItem', ['BnCommon', function(BnCommon) {
  return {
    scope: {
      data: '=ngModel',
    },
    templateUrl: 'js/sentence/item.html',
    controller: 'BnSentenceItemCtrl'
  };
}])

.controller('BnSentenceItemCtrl', ['$scope', 'BnCommon', '$http', function($scope, BnCommon, $http) {

  $scope.edit = false;
  $scope.showDict = false;
  $scope.dictUrl = "http://dict.cn";

  $scope.data.showRef = false;
  
  function init() {
    if (!!$scope.data.sentence) {
      $scope.sentenceHtml = $scope.data.sentence;
      for (var i in $scope.data.wordList) {
        $scope.sentenceHtml = $scope.sentenceHtml.replace($scope.data.wordList[i].word, '<span class="highlight-word">'+ $scope.data.wordList[i].word +'</span>')
      }
    }
    $scope.createDate = new Date($scope.data.timestamp).toLocaleString();
  }

  $scope.delete = function() {
    if (window.confirm("删除 ？")) {
      BnCommon.getRef('bnword').child($scope.data.key).remove(function () {
      })
    }
  }

  $scope.addWord = function() {
    $scope.data.wordList.push({
      word: '',
      comment: ''
    })
  }

  $scope.removeWord = function(item) {
    for (var i in $scope.data.wordList) {
      if ($scope.data.wordList[i] === item) {
        $scope.data.wordList.splice(i, 1);
        break;
      }
    }
  }

  $scope.update = function() {
    // if (!$scope.data.word) return;

    // var newWord = {
    //   word: $scope.data.word,
    //   strpho: !!$scope.data.strpho ? $scope.data.strpho : '',
    //   usertrans: !!$scope.data.usertrans ? $scope.data.usertrans : '',
    //   basetrans: !!$scope.data.basetrans ? $scope.data.basetrans : '',
    //   sentence: !!$scope.data.sentence ? $scope.data.sentence : '',
    //   url: !!$scope.data.url ? $scope.data.url : '',
    //   title: !!$scope.data.title ? $scope.data.title : '',
    //   type: $scope.data.type,
    //   timestamp: $scope.data.timestamp
    // }
    for (var i in $scope.data.wordList) {
      delete $scope.data.wordList[i].$$hashKey;
    }
    delete $scope.data.$$hashKey;
    BnCommon.getRef('bnword').child($scope.data.key).set($scope.data);
    $scope.edit = false;
    $scope.showDict = false;
  }

  $scope.searchWordOnDictCN = function(item) {
    if (!item || !item.word) return;
    $http.jsonp("http://fanyi.dict.cn/search.php?jsoncallback=JSON_CALLBACK&q=" + item.word)
    .success(function(data){
        // console.log(data);
        item.comment = '';
        if (!!data.out && !! data.out.translation) {
          data.out.translation.forEach(function(_item) {
            item.comment += _item.join();
          })
        }
    });

    $scope.dictUrl = 'http://dict.cn/' + item.word;
  }

  init();
}]);
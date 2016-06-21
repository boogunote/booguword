'use strict';

angular.module('bn.sentence.new',
    ['bn.common'])

.directive('bnSentenceNew', ['BnCommon', function(BnCommon) {
  return {
    templateUrl: 'js/sentence/new.html',
    controller: 'BnSentenceNewCtrl'
  };
}])

.controller('BnSentenceNewCtrl', ['$scope', 'BnCommon', '$http', function($scope, BnCommon, $http) {

  $scope.showDict = false;
  $scope.dictUrl = "http://dict.cn";
  $scope.data = {
    sentence: "",
    wordList: [{
      word: '',
      comment: ''
    }],
    title: '',
    url: '',
    type: 'sentence'
  };

  $scope.add   = function() {
    $scope.data.timestamp = Wilddog.ServerValue.TIMESTAMP;
    for (var i in $scope.data.wordList) {
      delete $scope.data.wordList[i].$$hashKey;
    }
    BnCommon.getRef('bnword').push($scope.data);

    $scope.data = {
      sentence: '',
      wordList: [{
        word: '',
        comment: ''
      }],
      title: '',
      url: '',
      type: 'sentence'
    };
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

  $scope.useLatestInfo = function() {
    $scope.data.title = $scope.itemList[0].title;
    $scope.data.url = $scope.itemList[0].url;
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

}]);
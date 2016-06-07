'use strict';

angular.module('bn.components.word.new',
    ['bn.common'])

.directive('bnWordNewDirective', ['BnCommon', function(BnCommon) {
  return {
    templateUrl: 'js/components/word/new.html',
    controller: 'BnWordNewCtrl'
  };
}])

.controller('BnWordNewCtrl', ['$scope', 'BnCommon', '$http', function($scope, BnCommon, $http) {

  $scope.showDict = false;
  $scope.dictUrl = "http://dict.cn";
  $scope.data = {};

  $scope.add   = function() {
    $scope.data.timestamp = Wilddog.ServerValue.TIMESTAMP;
    if (!!$scope.data.strpho) {
      $scope.data.strpho = $scope.data.strpho.trim();
      if ('[' != $scope.data.strpho[0]) $scope.data.strpho = '[' + $scope.data.strpho;
      if (']' != $scope.data.strpho[$scope.data.strpho.length-1]) $scope.data.strpho = $scope.data.strpho + ']';
    }
    $scope.data.type = 'word';
    BnCommon.getRef().push($scope.data)
    $scope.data = {}
  }

  $scope.searchWordOnDictCN = function() {
    $http.jsonp("http://fanyi.dict.cn/search.php?jsoncallback=JSON_CALLBACK&q=" + $scope.data.word)
    .success(function(data){
        // console.log(data);
        $scope.data.basetrans = '';
        if (!!data.out && !! data.out.translation) {
          data.out.translation.forEach(function(item) {
            $scope.data.basetrans += item.join();
          })
        }
    });

    $scope.dictUrl = 'http://dict.cn/' + $scope.data.word;
  }

  $scope.useLatestInfo = function() {
    $scope.data.title = $scope.itemList[0].title;
    $scope.data.url = $scope.itemList[0].url;
  }

}]);
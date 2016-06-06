'use strict';

angular.module('bn.ref', [])

.directive('bnRefDirective', ['BnCommon', function(BnCommon) {
  return {
    scope: {
      data: '=ngModel',
    },
    templateUrl: 'js/ref/index.html',
    controller: 'BnRefCtrl'
  };
}])

.controller('BnRefCtrl', ['$scope', 'BnCommon', function($scope, BnCommon) {

  $scope.srcList = [{
    name: 'Dict.cn',
    url: 'http://dict.cn/' + $scope.data
  },
  {
    name: 'Wiki',
    url: 'http://www.bing.com/search?q=' + $scope.data + '+site%3Aen.wikipedia.org'

  },
  {
    name: 'Urban',
    url: 'http://www.urbandictionary.com/define.php?term=' + $scope.data
  },
  {
    name: 'Bing',
    url: 'https://www.bing.com/search?q=' + $scope.data
  },
  {
    name: 'Academic',
    url: 'https://academic.microsoft.com/#/search?iq=%40' + $scope.data + '%40&q=' + $scope.data + '&filters=&from=0&sort=0'
  },
  {
    name: 'Google',
    url: 'https://www.google.com/search?q=' + $scope.data
  },
  {
    name: 'Scholar',
    url: 'https://scholar.google.com/scholar?hl=en&q=' + $scope.data + '&btnG=&as_sdt=1%2C5&as_sdtp='
  },
  {
    name: 'Merriam-Webster',
    url: 'http://www.merriam-webster.com/dictionary/' + $scope.data
  }]
}]);
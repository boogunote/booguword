'use strict';

angular.module('bnw.main', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('main', {
    url: '/main',
    templateUrl: 'main/index.html',
    controller: 'MainCtrl'
  });
}])

.controller('MainCtrl', [function() {

}]);
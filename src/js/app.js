'use strict';

(function() {
  // Declare app level module which depends on views, and components
  angular.module('bnw', [
    'ngSanitize',
    'templates',
    'ui.bootstrap',
    'ui.router',
    'bnw.common',
    'bnw.main',
    'bnw.login',
    'bnw.trans',
  ]).
  config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider){
    $locationProvider.hashPrefix('!');
    
    // For any unmatched url, send to /route1
    $urlRouterProvider.otherwise("/main");
    
    // $stateProvider
    //     .state('main', {
    //         url: "/main",
    //         templateUrl: "main/index.html",
    //         controller: 'MainCtrl'
    //     })
    //     .state('login', {
    //         url: "/login",
    //         templateUrl: "login/index.html",
    //         controller: 'LoginCtrl'
    //     })
  }])

  .run(['$rootScope', function($rootScope) {
    $rootScope.safeApply = function(fn) {
      if (!this.$root) {
        this.$apply(fn);
        return;
      }
      var phase = this.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
          if(fn && (typeof(fn) === 'function')) {
              fn();
          }
      } else {
          this.$apply(fn);
      }
    };
  }])
}());
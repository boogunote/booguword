'use strict';

// Declare app level module which depends on views, and components
angular.module('bnw', [
  'ui.bootstrap',
  'ui.router',
  'bnw.main',
  'bnw.login',
]).
config(function($locationProvider, $stateProvider, $urlRouterProvider){
  $locationProvider.hashPrefix('!');
  
  // For any unmatched url, send to /route1
  $urlRouterProvider.otherwise("/main")
  
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
})
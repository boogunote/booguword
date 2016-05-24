angular.module('bnw.common', [])

.factory('BnwCommon', ['$timeout', function($timeout) {
  var self = {}

  self.ref = new Wilddog("https://bn.wilddogio.com/");

  return self;
}]) 
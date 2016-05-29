angular.module('bnw.common', [])

.factory('BnwCommon', ['$timeout', function($timeout) {
  var self = {}

  self.ref = new Wilddog("https://bn.wilddogio.com/");

  self.getRef = function() {
    return self.ref.child(self.ref.getAuth().uid).child('/bnword/items/')
  }

  return self;
}]) 
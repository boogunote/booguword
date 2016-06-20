angular.module('bn.common', [])

.factory('BnCommon', ['$timeout', function($timeout) {
  var self = {}

  self.ref = new Wilddog("https://bn.wilddogio.com/");

  self.getRef = function() {
    return self.ref.child(self.ref.getAuth().uid).child('/bnword/items/')
  }

  self.initScope = function(scope, type) {
    scope.init = function() {
      scope.pageIndex = 0;
      scope.pageSize = 10;

      loadLatestPage();
    }

    function onData(snapshot) {
      var itemList = [];
      snapshot.forEach(function(data) {
        var item = data.val();
        item.key = data.key();
        itemList.push(item);
      });
      if (itemList.length <= 0) return;
      scope.startAt = itemList[0].timestamp;
      scope.endAt = itemList[itemList.length-1].timestamp;
      scope.endAtDate = new Date(scope.endAt);
      itemList.reverse();
      scope.safeApply(function() {
        scope.itemList = itemList;
      });
    }

    function loadLatestPage() {
      scope.endAt = new Date('3000/01/01').getTime(); // I don't think english will exist after that time.
      if (!!scope.currPageRef) scope.currPageRef.off('value');
      scope.currPageRef = self.getRef(type)
          .orderByChild("timestamp")
          .endAt(scope.endAt) // NOTICE: displayed items are reversed
          .limitToLast(scope.pageSize);

      scope.currPageRef.on("value", function(snapshot) {
        onData(snapshot);
        var itemList = snapshot.val();
        scope.latestTimestamp = 0;
        for (var key in itemList) {
          if (itemList[key].timestamp > scope.latestTimestamp)
            scope.latestTimestamp = itemList[key].timestamp;
        }
      })
    }

    scope.nextPage = function() {
      if (scope.pageSize != scope.itemList.length) return;
      if (!!scope.currPageRef) scope.currPageRef.off('value');
      scope.currPageRef = self.getRef(type)
          .orderByChild("timestamp")
          .endAt(scope.startAt-1) // NOTICE: displayed items are reversed
          .limitToLast(scope.pageSize);

      scope.currPageRef.on("value", onData)
    }

    scope.prevPage = function() {
      if (!!scope.currPageRef) scope.currPageRef.off('value');
      scope.currPageRef = self.getRef(type)
          .orderByChild("timestamp")
          .startAt(scope.endAt+1) // NOTICE: displayed items are reversed
          .limitToFirst(scope.pageSize);

      scope.currPageRef.on("value",  function(snapshot) {
        onData(snapshot);
        if (scope.itemList.length != scope.pageSize) loadLatestPage();
      })
    }

    scope.goToDate = function() {
        scope.endAtDate.setHours(23,59,59,999);
        scope.endAt = scope.endAtDate.getTime();
        if (!!scope.currPageRef) scope.currPageRef.off('value');
        scope.currPageRef = self.getRef(type)
            .orderByChild("timestamp")
          .endAt(scope.endAt) // NOTICE: displayed items are reversed
          .limitToLast(scope.pageSize);
      scope.currPageRef.on("value", onData)
    }
  }

  return self;
}])

.filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}])
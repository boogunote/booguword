angular.module('bn.common', [])

.factory('BnCommon', ['$timeout', function($timeout) {
  var self = {}

  self.ref = new Wilddog("https://bn.wilddogio.com/");

  self.getRef = function(type) {
    return self.ref.child(self.ref.getAuth().uid).child('/' + type + '/items/')
  }

  self.initScope = function(scope, type) {
    scope.init = function() {
      scope.pageIndex = 0;
      scope.pageSizeList = [5, 10, 20, 50, 100];
      scope.pageSize = 10;
      scope.shutdownMessage = false;

      loadLatestPage();
    }

    scope.$on('open-message', function() {
      scope.shutdownMessage = false;
    })

    scope.$on('shutdown-message', function() {
      scope.shutdownMessage = true;
    })

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

    function msgOnOffHandlerCreator(nextHandler) {
      return function(snapshot) {
        if (!scope.shutdownMessage) nextHandler(snapshot)
      }
    }

    function loadLatestPage() {
      scope.endAt = new Date('3000/01/01').getTime(); // I don't think english will exist after that time.
      if (!!scope.currPageRef) scope.currPageRef.off('value');
      scope.currPageRef = self.getRef(type)
          .orderByChild("timestamp")
          .endAt(scope.endAt) // NOTICE: displayed items are reversed
          .limitToLast(scope.pageSize);

      scope.currPageRef.on("value", msgOnOffHandlerCreator(function(snapshot) {
        onData(snapshot);
        var itemList = snapshot.val();
        scope.latestTimestamp = 0;
        for (var key in itemList) {
          if (itemList[key].timestamp > scope.latestTimestamp)
            scope.latestTimestamp = itemList[key].timestamp;
        }
      }))
    }

    scope.nextPage = function() {
      if (scope.pageSize != scope.itemList.length) return;
      if (!!scope.currPageRef) scope.currPageRef.off('value');
      scope.currPageRef = self.getRef(type)
          .orderByChild("timestamp")
          .endAt(scope.startAt-1) // NOTICE: displayed items are reversed
          .limitToLast(scope.pageSize);

      scope.currPageRef.on("value", msgOnOffHandlerCreator(function(snapshot) {
        onData(snapshot);
      }))
    }

    scope.prevPage = function() {
      if (!!scope.currPageRef) scope.currPageRef.off('value');
      scope.currPageRef = self.getRef(type)
          .orderByChild("timestamp")
          .startAt(scope.endAt+1) // NOTICE: displayed items are reversed
          .limitToFirst(scope.pageSize);

      scope.currPageRef.on("value", msgOnOffHandlerCreator(function(snapshot) {
        onData(snapshot);
        if (scope.itemList.length != scope.pageSize) loadLatestPage();
      }))
    }

    scope.changePageSize = function() {
      if (!!scope.currPageRef) scope.currPageRef.off('value');
      scope.currPageRef = self.getRef(type)
          .orderByChild("timestamp")
          .endAt(scope.startAt) // NOTICE: displayed items are reversed
          .limitToLast(scope.pageSize);

      scope.currPageRef.on("value", msgOnOffHandlerCreator(function(snapshot) {
        onData(snapshot);
      }))
    }

    scope.goToDate = function() {
      scope.endAtDate.setHours(23,59,59,999);
      scope.endAt = scope.endAtDate.getTime();
      if (!!scope.currPageRef) scope.currPageRef.off('value');
      scope.currPageRef = self.getRef(type)
          .orderByChild("timestamp")
        .endAt(scope.endAt) // NOTICE: displayed items are reversed
        .limitToLast(scope.pageSize);
      scope.currPageRef.on("value", msgOnOffHandlerCreator(function(snapshot) {
        onData(snapshot);
      }))
    }

    scope.$on("$destroy", function() {
      scope.currPageRef.off("value", onData)
    })

    // NOTICE: Why need this function? Wilddog advocates they can push any changes realtime.
    // However they just monitor every item in the range when you listen on value. Don't
    // include the item, which should be push back of the range, when I delete some items from
    // this range. So I should refresh list manually.
    scope.refresh = function() {
      if (!!scope.currPageRef) scope.currPageRef.off('value');
      scope.currPageRef = self.getRef(type)
          .orderByChild("timestamp")
        .endAt(scope.endAt) // NOTICE: displayed items are reversed
        .limitToLast(scope.pageSize);
      scope.currPageRef.on("value", msgOnOffHandlerCreator(function(snapshot) {
        onData(snapshot);
      }))
    }
  }

  return self;
}])

.filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}])
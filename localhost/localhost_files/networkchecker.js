cockpitApp.factory('onlineStatus', ['$window', '$rootScope', function ($window, $rootScope) {
    var onlineStatus = {};

    onlineStatus.onLine = $window.navigator.onLine;

    onlineStatus.isOnline = function() {
        return onlineStatus.onLine;
    }

    $window.addEventListener("online", function () {
        onlineStatus.onLine = true;
        $rootScope.$digest();
    }, true);

    $window.addEventListener("offline", function () {
        onlineStatus.onLine = false;
        $rootScope.$digest();
    }, true);

    return onlineStatus;
}])

cockpitApp.controller( 'OnlineStatusController', ['$scope', 'onlineStatus', function( $scope, onlineStatus ) {
    $scope.onlineStatus = onlineStatus;

    $scope.$watch('onlineStatus.isOnline()', function(online) {
        $scope.networkOnline = online ? 'networkOnline' : 'networkOffline';
        $scope.networkOnline2 = online ? 'color:rgb(76, 201, 76);font-size:20px' : 'color:red;font-size:20px';
    });
}])

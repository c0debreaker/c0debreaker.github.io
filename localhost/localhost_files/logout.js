'use strict';


cockpitApp.controller('LogoutCtrl', ['$state', 'User', '$interval', '$rootScope',  function($state, User, $interval, $rootScope) {
    User.removeAuthentication();

    $rootScope.mainbody.position = 'fixed';
//    $rootScope.dtListener();

    $interval.cancel($rootScope.timer1);$rootScope.timer1 = undefined;
    $interval.cancel($rootScope.timer2);$rootScope.timer2 = undefined;
    $interval.cancel($rootScope.timer3);$rootScope.timer3 = undefined;
    $interval.cancel($rootScope.timer4);$rootScope.timer4 = undefined;
    $interval.cancel($rootScope.timer5);$rootScope.timer5 = undefined;

    User.isAuthenticated();
}]);
/*global jQuery:true */
'use strict';

cockpitApp.controller('LoginCtrl', ['$scope', '$rootScope', '$state', 'User', function($scope, $rootScope, $state, User) {

        $scope.username = '';
        $scope.password = '';
        $scope.persist = true;
        $scope.errors = [];
        $scope.isFocused = false;

        var nextState = null;

        try {
            nextState = User.getNextState();
        } catch (e) {
            nextState = null;
        }

        if (nextState !== null) {
            var nameBuffer = nextState.name + '';
            var errorBuffer = nextState.error + '';
            User.clearNextState();
            nextState = {
                name: nameBuffer,
                error: errorBuffer
            };
            if (typeof nextState.error === 'string' && nextState.error !== '' && $scope.errors.indexOf(nextState.error) === -1) {
                $scope.errors.push(nextState.error);
            } else {
                $scope.errors.push('You must be logged in to view this page');
            }
        }

        $scope.$watch('isFocused', function(newValue, oldValue) {
            if ($scope.isFocused == true) {
                $scope.failureMessage  = "";
            }
        }, true);

        $scope.$watch('username', function(newValue, oldValue) {
            if (newValue == oldValue) {
                return
            } else {
                $scope.failureMessage  = "";
            }
        }, true);

        $scope.$watch('password', function(newValue, oldValue) {
            if (newValue == oldValue) {
                return
            } else {
                $scope.failureMessage  = "";
            }
        }, true);

        function disableLoginButton(message) {
            if (typeof message !== 'string') {
                message = 'Attempting login...';
            }
            jQuery('#login-form-submit-button').prop('disabled', true).prop('value', message);
        }

        function enableLoginButton(message) {
            if (typeof message !== 'string') {
                message = 'Submit';
            }
            jQuery('#login-form-submit-button').prop('disabled', false).prop('value', message);
        }

        function onSuccessfulLogin() {
            $scope.failureMessage  = "";
            $rootScope.mainbody.position = 'absolute';

            if (nextState !== null && typeof nextState.name === 'string' && nextState.name !== '') {
                console.log("calling nextState ......");
                $state.go(nextState.name, nextState.params);
            } else {
                $state.go('main', {}, {reload: true});
            }
        }

        function onFailedLogin(error) {
            $rootScope.login = {
                goodmsg : false,
                errormsg : true
            }
            $rootScope.mainbody.position = 'fixed';

            $scope.failureMessage = error;
            if (typeof error === 'string' && $scope.errors.indexOf(error) === -1) {
                $scope.errors.push(error);
            }
            enableLoginButton();
        }

        $scope.login = function() {
            disableLoginButton();

            $rootScope.login = {
                goodmsg : true,
                errormsg : false
            }

            $scope.failureMessage  = "Signing in to ZATAR ANALYTICS ....";
            User.authenticate($scope.username, $scope.password, onSuccessfulLogin, onFailedLogin, $scope.persist);
        };
    }]);
cockpitApp.factory('ModalHandler', ['$modal', function ($modal) {

    return {
        open : function (controller, templateUrl) {
            var modalInstance = $modal.open({
                templateUrl: templateUrl,
                controller: controller,
                size: 'sm',
                resolve: {
                    items: function () {
                        return true;
                    }
                }
            });
        }
    }
}])

cockpitApp.controller('ServerModalInstanceCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.modal_title_text = "SERVICE UNAVAILABLE";
    $scope.modal_body_text = "Services may be unable at this time.";
}]);

cockpitApp.controller('AuthModalInstanceCtrl', [ 'User', '$state', '$scope', '$modalInstance', function(User, $state, $scope, $modalInstance) {

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
        User.removeAuthentication();
        $state.go('login', {}, {reload: true});
    };
    $scope.modal_title_text = "AUTHENTICATION ERROR";
    $scope.modal_body_text = "Your authentication token has expired! Please sign-in again.";
}])

cockpitApp.controller('500InternalServerErrorCtrl', [ 'User', '$state', '$scope', '$modalInstance', function(User, $state, $scope, $modalInstance) {

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
       // User.removeAuthentication();
       // $state.go('login', {}, {reload: true});
    };
    $scope.modal_title_text = "MISSING DATASET";
    $scope.modal_body_text = "Data may not be available for this date. Please select another Day/Month/Year";
}])

cockpitApp.controller('AjaxSpinner', [ 'User', '$state', '$scope', '$modalInstance', 'SpinnerFactory', function(User, $state, $scope, $modalInstance, SpinnerFactory) {

    $scope.spinner = SpinnerFactory;
    console.log('current $scope.spinner.visible value ************', $scope.spinner.visible);
    console.log('modal instance', $modalInstance.result);
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
        // User.removeAuthentication();
        // $state.go('login', {}, {reload: true});
    };

    $scope.modal_title_text = "PROCESSING DATA ......";
    $scope.modal_body_text = "Please wait while data is being retrieved and prepared.";

    $scope.$watch('spinner.visible', function (newValue, oldValue) {
        console.log('watching spinner value ....');
        if ($scope.spinner.visible == false) {
            $modalInstance.dismiss('');
        }

    }, true);

}])

// How to call this modal
//    if (err.status == 500) {
//        ModalHandler.open('500InternalServerErrorCtrl', 'servererror.html');
//        // $state.go('login', {}, {reload: true});
//    } else {
//        ModalHandler.open('ServerModalInstanceCtrl', 'servererror.html');
//    }

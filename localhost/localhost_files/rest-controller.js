cockpitApp.factory('CockpitRestangular', ['Restangular', 'User', function(Restangular, User) {
        var user = User.getUserData();
        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl('http://localhost:8080/cockpit-data-service');
            RestangularConfigurer.setDefaultRequestParams({ token: user.bearerToken });
        })
}]);

cockpitApp.factory('ZatarTokenService', ['Restangular', 'BaamApiEndpoints', function(Restangular, BaamApiEndpoints) {

        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(BaamApiEndpoints.TokenService + 'v1');
            RestangularConfigurer.setDefaultHeaders({'Accept' : 'application/json; charset=utf-8', 'Content-Type': 'application/json; charset=utf-8'});
        })
}]);

cockpitApp.factory('AvatarIDFactory', ['Restangular', function(Restangular) {

    return Restangular.withConfig(function(RestangularConfigurer) {
//        RestangularConfigurer.setBaseUrl(BaamApiEndpoints.TokenService + 'v1');
        RestangularConfigurer.setDefaultHeaders({'Accept' : 'application/json; charset=utf-8', 'Content-Type': 'application/json; charset=utf-8'});
    })
}]);

cockpitApp.factory('RedshiftRestangular', ['Restangular', 'User', function(Restangular, User) {
        var user = User.getUserData();
        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl('http://localhost:3000/app/v1');
            RestangularConfigurer.setDefaultRequestParams({ token: user.bearerToken });
        })
}]);

//cockpitApp.factory('CassandraRestangular', ['Restangular', 'BAAMEnvironment', function(Restangular, BAAMEnvironment) {
//        var environment = BAAMEnvironment.getEndPoints();
//        return Restangular.withConfig(function(RestangularConfigurer) {
//                RestangularConfigurer.setBaseUrl(environment.DataService + 'baam-api/reports');
//        })
//}]);



// Odometer REST Endpoints

cockpitApp.factory('OdometerRestFactory', ['Restangular', 'User', 'BaamApiEndpoints', function(Restangular, User, BaamApiEndpoints) {

    var user = User.getUserData();

        return Restangular.withConfig(function(RestangularConfigurer) {
                RestangularConfigurer.setDefaultHttpFields({cache: true});
                RestangularConfigurer.setBaseUrl(BaamApiEndpoints.DataService);
                RestangularConfigurer.setDefaultRequestParams({ userresourceid : user.resourceId, tokenresourceid : user.tokenResourceId, token: user.bearerToken });
        })
}]);

// As a Service
//cockpitApp.service('OdometerRestService', ['Restangular', 'BAAMEnvironment', 'User', function(Restangular, BAAMEnvironment, User) {
//    var user = User.getUserData();
//    var environment = BAAMEnvironment.getEndPoints();
//    this.list = function () {
//        return Restangular.withConfig(function(RestangularConfigurer) {
//            RestangularConfigurer.setBaseUrl(environment.DataService + 'baam-api');
//            RestangularConfigurer.setDefaultRequestParams({ userresourceid : user.resourceId, tokenresourceid : user.tokenResourceId, token: user.bearerToken });
//        })
//    }
//}]);

cockpitApp.factory('BrowserLanguageFactory', ['Restangular', 'BaamApiEndpoints', function(Restangular, BaamApiEndpoints) {
    return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setDefaultHttpFields({cache: false});
        RestangularConfigurer.setBaseUrl(BaamApiEndpoints.DataService);
    })
}]);

cockpitApp.controller('getSummaryCockpitUsersController', ['$scope', 'CockpitRestangular', function($scope, CockpitRestangular) {
    CockpitRestangular.all("summary").getList().then(function(response) {
        var ctr = 0;
        response.forEach(function(entry) {
                // workaround for resourceId since it doesn't exist in REST API for now
                response[ctr].resourceId = entry.href.match('.*/(.*)')[1];
                ctr++;
            }
        );
        $scope.allSummary = response;
    });
}]);

cockpitApp.controller('getAllCockpitUsersController', ['$scope', 'CockpitRestangular', function($scope, CockpitRestangular) {
    CockpitRestangular.all("users").getList().then(function(response) {
        $scope.allUsers = response;
    });
}]);

cockpitApp.controller('getOneCockpitUserController', ['$scope', '$stateParams', 'CockpitRestangular', function($scope, $stateParams, CockpitRestangular) {
    CockpitRestangular.one("users", $stateParams.resourceId).get().then(function(response) {
        $scope.OneCockpitUser = response;
    });
}]);

cockpitApp.controller('getAllDevicesCtrl', ['$scope', '$stateParams', 'CockpitRestangular', function($scope, $stateParams, CockpitRestangular) {
    CockpitRestangular.one('users', $stateParams.resourceId).getList('devices').then(function(response){
        $scope.allDevices = response;
    });
}]);

cockpitApp.controller('getAllMembersCtrl', ['$scope', '$stateParams', 'CockpitRestangular', function($scope, $stateParams, CockpitRestangular) {
    CockpitRestangular.one('users', $stateParams.resourceId).getList('members').then(function(response){
        $scope.allMembers = response;
    });
}]);

cockpitApp.controller('getOneDevicesCtrl', ['$scope', '$stateParams', 'CockpitRestangular', function($scope, $stateParams, CockpitRestangular) {
    $scope.allDevices = CockpitRestangular.one('users', $stateParams.resourceId).getList('devices');
}]);

cockpitApp.controller('getMembersCtrl', ['$scope', '$stateParams', 'CockpitRestangular', function($scope, $stateParams, CockpitRestangular) {
    $scope.allMembers = CockpitRestangular.one('users', $stateParams.resourceId).getList('members')
}]);

/*
            REDSHIFT Endpoint callers

*/
cockpitApp.controller('getRedshiftDataController', ['$scope', 'RedshiftRestangular', function($scope, RedshiftRestangular) {
    RedshiftRestangular.all("devices").getList().then(function(response) {
        $scope.allRedshiftDevices = response;
    });
}]);

cockpitApp.controller('getRedshiftDataController1', ['$scope', 'RedshiftRestangular', function($scope, RedshiftRestangular) {
    RedshiftRestangular.all("usagebyuser").getList().then(function(response) {
        $scope.allRedshiftDevices = response;
    });
}]);

cockpitApp.controller('getRedshiftDataController2', ['$scope', 'RedshiftRestangular', function($scope, RedshiftRestangular) {
    RedshiftRestangular.all("numofmembers").getList().then(function(response) {
        $scope.allRedshiftDevices = response;
    });
}]);

cockpitApp.controller('getRedshiftDataController3', ['$scope', 'RedshiftRestangular', function($scope, RedshiftRestangular) {
    RedshiftRestangular.all("numofdevices").getList().then(function(response) {
        $scope.allRedshiftDevices = response;
    });
}]);

cockpitApp.controller('getRedshiftDataController4', ['$scope', 'RedshiftRestangular', function($scope, RedshiftRestangular) {
    RedshiftRestangular.all("numbytespermember").getList().then(function(response) {
        $scope.allRedshiftDevices = response;
    });
}]);


cockpitApp.factory('ChartServicesTotalBytes', ['RedshiftRestangular', '$q', 'User', function(RedshiftRestangular, $q, User) {
        var deferredLoad = $q.defer();
        var isLoaded = deferredLoad.promise;

        var TotalBytesUsedPerWorld = { "jsonData" : "" };

        isLoaded.then(function(data) {
            TotalBytesUsedPerWorld.jsonData = data;
            return TotalBytesUsedPerWorld;
        });

         return {
            getJsonData : function() {
                return isLoaded;
            },
            initJsonData : function() {
                var user = User.getUserData();
                RedshiftRestangular.all("totalbytesusage").getList({token : user.bearerToken})
                    .then(function(response) {
                        deferredLoad.resolve(response);
                    }, function(res){
                        deferredLoad.reject({'error' : res });
                    })
            }
        };
    }])

cockpitApp.factory('ChartServicesNumberOfBytes', ['RedshiftRestangular', '$q', 'User', function(RedshiftRestangular, $q, User) {
        var deferredLoad = $q.defer();
        var isLoaded = deferredLoad.promise;

        var NumberOfBytesPerWorld = { "jsonData" : "" };

        isLoaded.then(function(data) {
            NumberOfBytesPerWorld.jsonData = data;
            return NumberOfBytesPerWorld;
        });

            return {
            getJsonData : function() {
                return isLoaded;
            },
            initJsonData : function() {
                var user = User.getUserData();
                RedshiftRestangular.all("numberofbytesperworldpermember").getList({token : user.bearerToken})
                    .then(function(response) {
                        deferredLoad.resolve(response);
                    }, function(res){
                        deferredLoad.reject({'error' : res });
                    })
            }
        };
    }])

cockpitApp.factory('ChartServicesNumberOfDevices', ['RedshiftRestangular', '$q', 'User', function(RedshiftRestangular, $q, User) {
        var deferredLoad = $q.defer();
        var isLoaded = deferredLoad.promise;

        var NumberOfDevicesPerWorld = { "jsonData" : "" };

        isLoaded.then(function(data) {
            NumberOfDevicesPerWorld.jsonData = data;
            return NumberOfDevicesPerWorld;
        });

         return {
            getJsonData : function() {
                return isLoaded;
            },
            initJsonData : function() {
                var user = User.getUserData();
                RedshiftRestangular.all("numberofdevicesperdworld").getList({token : user.bearerToken})
                    .then(function(response) {
                        deferredLoad.resolve(response);
                    }, function(res){
                        deferredLoad.reject({'error' : res });
                    })
            }
        };
    }])

cockpitApp.factory('ChartServicesNumberOfMembers', ['RedshiftRestangular', '$q', 'User', function(RedshiftRestangular, $q, User) {
        var deferredLoad = $q.defer();
        var isLoaded = deferredLoad.promise;

        var NumberOfMembersPerWorld = { "jsonData" : "" };

        isLoaded.then(function(data) {
            NumberOfMembersPerWorld.jsonData = data;
            return NumberOfMembersPerWorld;
        });

        return {
            getJsonData : function() {
                return isLoaded;
            },
            initJsonData : function() {
                var user = User.getUserData();
                RedshiftRestangular.all("numberofmembersperworld").getList({token : user.bearerToken})
                    .then(function(response) {
                        deferredLoad.resolve(response);
                    }, function(res){
                        deferredLoad.reject({'error' : res });
                    })
            }
        };
    }])

cockpitApp.factory('ChartServicesAverageLatency', ['RedshiftRestangular', '$q', 'User', function(RedshiftRestangular, $q, User) {
        var deferredLoad = $q.defer();
        var isLoaded = deferredLoad.promise;

        var AverageLatency = { "jsonData" : "" };

        isLoaded.then(function(data) {
            AverageLatency.jsonData = data;
            return AverageLatency;
        });

        return {
            getJsonData : function() {
                return isLoaded;
            },
            initJsonData : function() {
                var user = User.getUserData();
                RedshiftRestangular.all("averagelatency").getList({token : user.bearerToken})
                    .then(function(response) {
                        deferredLoad.resolve(response);
                    }, function(res){
                        deferredLoad.reject({'error' : res });
                    })
            }
        };
    }])


cockpitApp.factory('ChartHourly', ['RedshiftRestangular', '$q', 'User', function(RedshiftRestangular, $q, User) {
    var deferredLoad = $q.defer();
    var isLoaded = deferredLoad.promise;

    var AverageLatency = { "jsonData" : "" };

    isLoaded.then(function(data) {
        AverageLatency.jsonData = data;
        return AverageLatency;
    });

    return {
        getJsonData : function() {
            return isLoaded;
        },
        initJsonData : function() {
            var user = User.getUserData();
            RedshiftRestangular.all("averagelatency").getList({token : user.bearerToken})
                .then(function(response) {
                    deferredLoad.resolve(response);
                }, function(res){
                    deferredLoad.reject({'error' : res });
                })
        }
    };
}])

cockpitApp.factory('$Primus', ['$rootScope', function($rootScope) {
        'use strict';

        var socket = $rootScope.socket;

// Private function to handle an incoming request via primus
// and invoke the callback function with the correct arguments
        var onCallback = function (callback, args) {
            $rootScope.$apply(function () {
                callback.apply(socket, args);
            });
        };

// Private function to handle an optional callback when sending data
// via Primus.
        var emitCallback = function (callback, args) {
            $rootScope.$apply(function () {
                if (callback) {
                    callback.apply(socket, args);
                }
            });
        };

        var $Primus = {};

        $Primus.on = function(name, callback) {
            socket.on(name, function() {
                onCallback(callback, arguments);
            });
        };

        $Primus.send = function(name, data, callback) {
            socket.send(name, angular.fromJson(angular.toJson(data)), function () {
                emitCallback(callback, arguments);
            });
        };

        return $Primus;
    }]);

// Cassandra
cockpitApp.factory('MonthlyCassandraFactory', ['CassandraRestangular', '$q', 'User', function(CassandraRestangular, $q, User) {
    var deferredLoad = $q.defer();
    var isLoaded = deferredLoad.promise;

    var MonthlyBytes = { "jsonData" : "" };

    isLoaded.then(function(data) {
        MonthlyBytes.jsonData = data;
        return MonthlyBytes;
    });

    return {
        getJsonData : function() {
            return isLoaded;
        },
        initJsonData : function() {
            var user = User.getUserData();
            CassandraRestangular.all("monthly").getList({token : user.bearerToken})
                .then(function(response) {
                    deferredLoad.resolve(response);
                }, function(res) {
                    deferredLoad.reject({'error' : res });
                })
        }
    };
}])

cockpitApp.factory('DailyCassandraFactory', ['CassandraRestangular', '$q', 'User', function(CassandraRestangular, $q, User) {
    var deferredLoad = $q.defer();
    var isLoaded = deferredLoad.promise;

    var MonthlyBytes = { "jsonData" : "" };

    isLoaded.then(function(data) {
        MonthlyBytes.jsonData = data;
        return MonthlyBytes;
    });

    return {
        getJsonData : function() {
            return isLoaded;
        },
        initJsonData : function() {
            var user = User.getUserData();
            CassandraRestangular.all("daily").getList({token : user.bearerToken})
                .then(function(response) {
                    deferredLoad.resolve(response);
                }, function(res){
                    deferredLoad.reject({'error' : res });
                })
        }
    };
}])

// This is required for specific device
cockpitApp.factory('DeviceUDIFactory', function() {

    var _device = { udi : undefined };
    return _device;

})

// This is required for specific device
cockpitApp.factory('AvatarIdMapFactory', function() {

    var _listing = { idListing : undefined };
    return _listing;

})

cockpitApp.factory('SpinnerFactory', function() {

    var _spinner = { visible : undefined };
    return _spinner;

})

cockpitApp.factory('OdometerSlidingPanelFactory', function() {

    var _panel  = { toggleOdometerPanel : false };
    return _panel;

})
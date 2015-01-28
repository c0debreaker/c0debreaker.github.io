cockpitApp.config(['$provide', '$httpProvider', function ($provide, $httpProvider) {

    // Intercept http calls.

    $provide.factory('BaamHttpInterceptor', ['$q', '$injector', '$rootScope', '$timeout', function($q, $injector, $rootScope, $timeout) {

        var downloadCsvTimeout;

        return {
            // On request success
            request: function (config) {

                if ( config.method == 'GET' && (config.url.indexOf('v1/csvexport/months') != -1  || config.url.indexOf('v1/csvexport/days') != -1 || config.url.indexOf('v1/csvexport/hours') != -1) ) {
                    var promise = $q.when(config).then(function(config) {
                        config.headers['Content-Type'] = 'application/csv; charset=utf-8';
                        return config;
                    });
                    return promise;
                }
                if (config.method == 'POST' && config.url.indexOf('v1/authentokens') != -1 ) {
                    config.headers['Accept'] = 'application/json; charset=utf-8';
                    config.headers['Content-Type'] = 'application/json; charset=utf-8';
                }

                // Return the config or wrap it in a promise if blank.
                return config || $q.when(config);
            },

            // On request failure
            requestError: function (rejection) {
                //  console.log('$httpInterceptor2',rejection); // Contains the data about the error on the request.

                // Return the promise rejection.
                return $q.reject(rejection);
            },

            // On response success
            response: function (response) {
                //    console.log('$httpInterceptor3',response); // Contains the data from the response.

                // Return the response or promise.
                return response || $q.when(response);
            },

            // On response failture
            responseError: function (rejection) {
                if (typeof rejection.data == 'undefined') {
                    return;
                }

                $rootScope.downloadStatus = rejection.data.message;

                if ($rootScope.modalDialogs) {
                    if ($rootScope.modalDialogs.loadingSpinner !== undefined ) {
                        $rootScope.modalDialogs.loadingSpinner = false;
                    }
                }

                if (rejection.data.status == 500) {
                    $rootScope.modalDialogs.unknownError = true;
                    $rootScope.modalDialogs.serverError = rejection.data.message;
                }
                if (rejection.data.status == 401) {
                    var $state = $injector.get('$state');
                    var User = $injector.get('User');
                    window.localStorage.removeItem('avatarIdCollection');
                    window.localStorage.removeItem('queryStringParams');
                    $rootScope.activeDate = undefined;
                    $rootScope.modalDialogs.tokenExpired = true;
                }
                if (rejection.data.status == 404 && rejection.data.message.indexOf('still being generated') != -1) {
//                    if (downloadCsvTimeout) {
//                        $timeout.cancel(downloadCsvTimeout);
//                    }
//
//                    downloadCsvTimeout = $timeout(function() {
//                        console.log('retrying GET ....');
//                        var OdometerRestFactory = $injector.get('OdometerRestFactory');
//                        OdometerRestFactory.all('csvexport').get($rootScope.path, {
//                            reportresourceid : $rootScope.downloadToken
//                        }).then(function(csvdata) {
//                                downloadCsvStream(csvdata, $rootScope.csvFilename);
//                                $rootScope.csvFilename = "";
//                                $rootScope.modalDialogs.generatingCsvReport = false;
//                            }, function(errorResponse){
//                                console.log('Reason for failure in Factory:', errorResponse.data.message);
//                            })
//                        }, 10000);
                }
                // Return the promise rejection.
                return $q.reject(rejection);
            }
        };
    }]);

    // Add the interceptor to the $httpProvider.
    $httpProvider.interceptors.push('BaamHttpInterceptor');

}]);

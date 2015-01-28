var cockpitApp = angular.module('CockpitApplication', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngAnimate',
    'ui.bootstrap',
    'ui.router',
    'ui.grid',
    'ui.grid.resizeColumns',
    'restangular',
    'googlechart',
    'ngTable',
    'multi-select',
    'ngModal',
    'angular-loading-bar',
    'tmh.dynamicLocale',
    'services.config',
    'Property.Maps'
//    'ngCacheBuster'
  ]);

//    cockpitApp.factory('Poller', function($http, $q){
//        return {
//            poll : function(url){
//                var deferred = $q.defer();
//                $http.get(url).then(function (res) {
//                    deferred.resolve(res.data);
//                }, function(res) {
//                    deferred.reject({ "sitestatus": 'Site inaccessible!' });
//                }
//                );
//                return deferred.promise;
//            }
//        }
//    });
//
//    cockpitApp.controller('NetworkChecker', ['$scope', '$rootScope', '$interval', 'Poller',  'ChartServicesTotalBytes', 'ChartServicesNumberOfBytes', 'ChartServicesNumberOfDevices', 'ChartServicesNumberOfMembers', 'ChartServicesAverageLatency', function($scope, $rootScope, $interval,  Poller, ChartServicesTotalBytes, ChartServicesNumberOfBytes, ChartServicesNumberOfDevices, ChartServicesNumberOfMembers, ChartServicesAverageLatency) {
//        $scope.siteChecker = Poller.poll('http://neil.privatedns.org/live.json');
//        $scope.siteChecker.then(function(res) {
//                console.log("Online");
//                $rootScope.online = true;
//                $scope.data = res;
//            }, function(res) {
//                console.log("offline");
//                $rootScope.online = false;
//                $scope.data = res;
//            }
//        );
//
//        var Repeater = function () {
//            $scope.$apply(function () {
//                $scope.siteChecker = Poller.poll('http://neil.privatedns.org/live.json');
//                $scope.siteChecker.then(function(res) {
//                    if ($rootScope.online === false) {
//                        console.log("retrieving latest json from REST api .....");
////                        ChartServicesTotalBytes.changeValueInJsonData();
////                        $scope.dataLoader = ChartServicesTotalBytes.getJsonData();
////                        $scope.dataLoader.then(function(data) {
////                                $scope.jsonData = data;
////                                dataChecker = true;
////                                $scope.bigstackedchart = plotStackedColumnChartTemplateForGoogleCharts($scope.jsonData, 'Total Bytes Used Aggregated by World (Received/Sent)', 'user_name', 'totalbytesent', 'totalbytesreceived', 'totalbytes'); // totalbytes should never be included in stacked column, just added it to make chart beautiful, LOL
////                                $scope.$watch('jsonData', function(newValue, oldValue) {
////                                    if (newValue === oldValue) {
////                                        console.log("value is the same");
////                                        return;
////                                    }
////                                    console.log("value is not the same");
////                                    $scope.bigstackedchart = plotStackedColumnChartTemplateForGoogleCharts($scope.jsonData, 'Total Bytes Used Aggregated by World (Received/Sent)', 'user_name', 'totalbytesent', 'totalbytesreceived', 'totalbytes'); // totalbytes should never be included in stacked column, just added it to make chart beautiful, LOL
////                                }, true);
////                            }
////                        );
//
////                        ChartServicesNumberOfBytes.initJsonData();
////                        ChartServicesNumberOfDevices.initJsonData();
////                        ChartServicesNumberOfMembers.initJsonData();
////                        ChartServicesAverageLatency.initJsonData();
//                    }
//                    $rootScope.online = true;
//                    $scope.data = res;
//                }, function(res) {
//                    $rootScope.online = false;
//                    $scope.data = res;
//                }
//               );
//            });
//        };
//        var timer = $interval(Repeater, 5000);
//    }]);

//    cockpitApp.run(['$window', '$location', '$rootScope', '$state', 'User', 'ChartServicesTotalBytes', 'ChartServicesNumberOfBytes', 'ChartServicesNumberOfDevices', 'ChartServicesNumberOfMembers', 'ChartServicesAverageLatency','SocketDispatcher','MonthlyCassandraFactory','DailyCassandraFactory', 'User',
//        function($window, $location, $rootScope, $state, User, ChartServicesTotalBytes, ChartServicesNumberOfBytes, ChartServicesNumberOfDevices, ChartServicesNumberOfMembers, ChartServicesAverageLatency, SocketDispatcher, MonthlyCassandraFactory, DailyCassandraFactory, User) {

    cockpitApp.controller('MainBodyCtrl', ['$rootScope', '$scope', 'User', 'tmhDynamicLocale','CurrentLocaleFactory', function($rootScope, $scope, User, tmhDynamicLocale, CurrentLocaleFactory) {
        if (User.isAuthenticated()) {

            $rootScope.mainbody = {
                position : 'absolute'
            }

            var user = User.getUserData();

            $scope.currentLocale = CurrentLocaleFactory;
            $scope.currentLocale.locale = user.locale;

        } else {
            $rootScope.mainbody = {
                position : 'fixed'
            }
            $rootScope.modalDialogs = {}
        }

    }]);

    cockpitApp.run(['$window', '$location', '$rootScope', '$state', 'User', 'SocketDispatcher', '$locale', 'OdometerRestFactory', '$timeout',
        function($window, $location, $rootScope, $state, User, SocketDispatcher, $locale, OdometerRestFactory, $timeout) {

            // IE fix
            window.console = window.console || { log : function() {} };
            // Initialize date
            $rootScope.dt = new Date();
            var specFuncs = new Baam.SpecFuncs();
            var downloadCsvTimeout;
            var foundIndex;
            $rootScope.csvRequestCollection = [];

//            var ext_credentials = $cookieStore.get('ext_credentials');
//            if ( ext_credentials !== undefined ) {
//                console.log('ext_credentials', ext_credentials);
//            }

            // Setup SockJS connection
//            SocketDispatcher.initSocket();
            var closeEventStatus = function() {
                if ($rootScope.csvRequestCollection.length == 0) {
                    $rootScope.rotate = false;
                    $rootScope.modalDialogs.generatingCsvReport = false;
                    $rootScope.modalDialogs.showReportDetails = false;
                }
            }

            // Let's set the HTTP INTERCEPTOR
            OdometerRestFactory.setErrorInterceptor(function(response) {
                $rootScope.modalDialogs.loadingSpinner = false;
                if ( response.data.status == 401 ) {
                    $rootScope.modalDialogs.tokenExpired = true;
                } else if ( response.data.status == 404 && response.data.message.indexOf('still being generated') != -1 ) {
                    if (downloadCsvTimeout) {
                        $timeout.cancel(downloadCsvTimeout);
                    }

                    downloadCsvTimeout = $timeout(function() {
                        for (var csvCtr = 0; csvCtr < $rootScope.csvRequestCollection.length; csvCtr++ ) {
                            $rootScope.rotate = true;

                            OdometerRestFactory.all('csvexport').get($rootScope.csvRequestCollection[csvCtr].csvPath, {
                                reportresourceid : $rootScope.csvRequestCollection[csvCtr].downloadToken
                            }).then(function(csvdata) {
                                    downloadCsvStream(csvdata, $rootScope.csvRequestCollection[foundIndex].csvFilename);
                                    // Let's remove it from the collection since we've downloaded it.
                                    $rootScope.csvRequestCollection.splice(foundIndex, 1);
                                    $rootScope.csvRequestCollectionCount = $rootScope.csvRequestCollection.length;
                                    $rootScope.csvFilename = "";
                                    closeEventStatus();
                                }, function(errorResponse){
                                    console.log('Reason for failure in Factory:', errorResponse.data.message);
                                })
                        }
                    }, 10000);
                } else {
//                        console.log("[OdometerRestFactory.setErrorInterceptor] Response received with HTTP error code: " + response.status );
                }
                if ( response.status == 500 ) {
                    $rootScope.modalDialogs.unknownError = true;
                    $rootScope.modalDialogs.serverError = response.status + ' ' + response.statusText + ' ' + response.data.message;
                }
                return false; // stop the promise chain
            });

            OdometerRestFactory.setResponseInterceptor(function (data, operation, what, url, response) {
                if ( operation == 'post' && (url.indexOf('v1/gdcsvexport/gateway/months') != -1
                    || url.indexOf('v1/gdcsvexport/gateway/days') != -1
                    || url.indexOf('v1/gdcsvexport/gateway/hours') != -1
                    || url.indexOf('v1/gdcsvexport/device/months') != -1
                    || url.indexOf('v1/gdcsvexport/device/hours') != -1
                    || url.indexOf('v1/gdcsvexport/device/days') != -1
                    ) ) {
                    $rootScope.downloadToken = response.headers('Location').split('/')[response.headers('Location').split('/').length-1];
                }
                if ( operation == 'post' && (url.indexOf('v1/csvexport/months') != -1  || url.indexOf('v1/csvexport/days') != -1 || url.indexOf('v1/csvexport/hours') != -1) ) {
                    $rootScope.downloadToken = response.headers('Location').split('/')[response.headers('Location').split('/').length-1];
                    $rootScope.csvRequestCollection.push({
                        downloadToken : $rootScope.downloadToken,
                        csvPath : what,
                        startDate : response.config.params.startdate,
                        endDate : response.config.params.enddate,
                        timeZone : response.config.params.timezone,
                        tokenResourceId : response.config.params.tokenresourceid,
                        userResourceId : response.config.params.userresourceid
                    });
                    $rootScope.csvRequestCollectionCount = $rootScope.csvRequestCollection.length;
                }
                if ( operation == 'get' && (url.indexOf('v1/csvexport/months') != -1  || url.indexOf('v1/csvexport/days') != -1 || url.indexOf('v1/csvexport/hours') != -1) ) {
                    if ( response.headers('Content-Disposition' ) == null ) {
                        $rootScope.csvFilename = specFuncs.generateRandomText(20, 'csv');
                        if (!response.config.params.requestType) {
                            foundIndex = _.findIndex($rootScope.csvRequestCollection, function(a) { return a.downloadToken == response.config.params.reportresourceid })
                            $rootScope.csvRequestCollection[foundIndex].csvFilename = $rootScope.csvFilename;
                            $rootScope.csvRequestCollectionCount = $rootScope.csvRequestCollection.length;
                        }
                    } else {
                        $rootScope.csvFilename = response.headers('Content-Disposition').split('=')[1];
                        if (!response.config.params.requestType) {
                            foundIndex = _.findIndex($rootScope.csvRequestCollection, function(a) { return a.downloadToken == response.config.params.reportresourceid })
                            $rootScope.csvRequestCollection[foundIndex].csvFilename = $rootScope.csvFilename;
                            $rootScope.csvRequestCollectionCount = $rootScope.csvRequestCollection.length;
                        }
                    }
                    $rootScope.modalDialogs.loadingSpinner = false;
                }
                return response.data;
            });

            try  {
               User.isAuthenticated();
            } catch(e) {
                // do nothing with this error
            }
            $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
                if (error.name === 'AuthenticationRequired') {
                    User.setNextState(toState.name, 'You must login to access this page');
                    $state.go('main', {}, {reload: true});
                }
            });
        }]);

    cockpitApp.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = true;
        cfpLoadingBarProvider.includeBar = true;
    }])

    cockpitApp.config(['tmhDynamicLocaleProvider', function(tmhDynamicLocaleProvider) {
        tmhDynamicLocaleProvider.localeLocationPattern('assets/i18n/angular-locale_{{locale}}.js');
    }])

    cockpitApp.config(['ngModalDefaultsProvider', function(ngModalDefaultsProvider) {
        ngModalDefaultsProvider.set('closeButtonHtml', '<i class="glyphicon glyphicon-remove-circle"></i>');
    }])
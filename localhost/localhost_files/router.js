cockpitApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$injector', function($stateProvider, $urlRouterProvider, $locationProvider, $injector) {

    $locationProvider.html5Mode(true);

//    $urlRouterProvider.otherwise("/main");
//    $urlRouterProvider.otherwise("main");

    $stateProvider
//        .state("login", {
//          //  url: "/login",
//            templateUrl: 'views/login2.html',
//            controller: 'LoginCtrl'
//        })
        .state('logout',
        {
          //  url: "/logout",
            controller: 'LogoutCtrl'
        })
        .state("main", {
            url: "/",
            views: {
                '' : { templateUrl: 'views/main.html' },
                'performance-ui-view@main': {
                    templateUrl: 'views/odometer.html' //,
//                    controller : 'OdometerCtrl'
//                    resolve: {
//                        resolvedUserData : ['User','$q','$timeout', function(User, $q, $timeout) {
//
//                            var deferred = $q.defer();
//                            var userData = '';
//                            $timeout(function() {
//                                userData = User.getUserData();
//                                if (userData) {
//                                    deferred.resolve(userData);
//                                }
//                            }, 1000);
//
//                            return deferred.promise;
//                        }]
//                    }

                } //,
//                'areastacked@main': {
//                    templateUrl: 'views/areastackedchart.html',
//                    controller: 'generateTotalBytesUsedPerWorldforAreaStackedController'
//                }

            }
        })

//        .state("chartsvc", {
//            url: "/chartsvc",
//            views: {
//                '' : { templateUrl: 'views/main.html' },
//                'performance-ui-view@chartsvc': {
//                    templateUrl: 'views/sdm-odometer.html'
//                }
//            }
//        })

        .state("hr", {
//            url: "/hr",
            views: {
                '': { templateUrl: 'views/main.html' },
                'performance-ui-view@main': {
                    templateUrl: 'views/duration.html'
                },
                'hourlychart-uiview@main': {
                    templateUrl: 'views/durationchart.html',
                    controller: 'generateTotalBytesUsedHourlyController'
                }

            }
        })

        .state("main.disabled", {})
        .state("main.graphs", {
//            url: "/graphs",
            templateUrl: 'views/graph.html'
        })

        .state("main.users",{
//            url: "/users",
            views: {
                'performance-ui-view@main': {
                    templateUrl: 'views/tenantsdynamictab.html',
                    controller: 'getAllCockpitUsersController'
                }
            }
        })
        .state("main.mainpane",{
//            url: "/mainpane",
            views: {
                'mainpane@main': {
                    templateUrl: 'views/summarytab.html',
                    controller: 'getSummaryCockpitUsersController'
                }
            }
        })
        .state("main.summary",{
//            url: "/summary",
            views: {
                'performance-ui-view@main': {
                    templateUrl: 'views/summarytab.html',
                    controller: 'getSummaryCockpitUsersController'
                }
            }
        })
        .state("main.select2",{
//            url: "/select2",
            views: {
                'performance-ui-view@main': {
                    templateUrl: 'views/select2.html',
                    controller: 'getSummaryCockpitUsersController'
                }
            }
        })
        .state("main.empty",{
//            url: "/empty",
            views: {
                'performance-ui-view@main': {
                    templateUrl: 'views/empty.html'
         //           controller: 'getSummaryCockpitUsersController'
                }
            }
        })
        .state("main.redshift",{
//            url: "/getredshift/:customroute",
            views: {
                'performance-ui-view@main': {
                    templateUrl: 'views/redshifttemplate.html',
                    controller: 'getRedshiftDataController'
                }
            }
        })

        .state("main.redshift1",{
//            url: "/usagebyuser",
            views: {
                'performance-ui-view@main': {
                    templateUrl: 'views/redshifttemplate.html',
                    controller: 'getRedshiftDataController1'
                }
            }
        })
        .state("main.redshift2",{
//            url: "/numofmembers",
            views: {
                'performance-ui-view@main': {
                    templateUrl: 'views/redshifttemplate.html',
                    controller: 'getRedshiftDataController2'
                }
            }
        })
        .state("main.redshift3",{
//            url: "/numofdevices",
            views: {
                'performance-ui-view@main': {
                    templateUrl: 'views/redshifttemplate.html',
                    controller: 'getRedshiftDataController3'
                }
            }
        })

        .state("main.redshift4",{
//            url: "/numbytespermember",
            views: {
                'performance-ui-view@main': {
                    templateUrl: 'views/redshifttemplate.html',
                    controller: 'getRedshiftDataController4'
                }
            }
        })

//        .state("main.monthlycassandra.dailycassandra",{
//            url: "/dailycassandra",
//            views: {
//                url: "/edit/:id",
////                'performance-ui-view@main': {
////                    templateUrl: 'views/performancetab.html'
////                },
//                'cassandrachart@main': {
//                    templateUrl: 'views/dailyudichart.html',
//                    controller: 'generateDailyCassandraChartController'
//                }
//            }
//        })



        // For plotting Area Stack
        .state("main.plottotalbytesusage",{
//            url: "/plottotalbytesusage",
            views: {
//                'performance-ui-view@main': {
//                    templateUrl: 'views/performancetab.html'
//                },
                'areastacked@main': {
                    templateUrl: 'views/areastackedchart.html',
                    controller: 'generateTotalBytesUsedPerWorldforAreaStackedController'
                }
            }
        })



        .state("main.plotnumberofbytesperworldpermember",{
//            url: "/plotnumberofbytesperworldpermember",
            views: {
                'areastacked@main': {
                    templateUrl: 'views/areastackedchart.html',
                    controller: 'generateNumberOfBytesPerWorldforAreaStackedController'
                }
            }
        })

        .state("main.plotnumberofdevicesperdworld",{
//            url: "/plotnumberofdevicesperdworld",
            views: {
                'areastacked@main': {
                    templateUrl: 'views/areastackedchart.html',
                    controller: 'generateNumberOfDevicesPerWorldforAreaStackedController'
                }
            }
        })

        .state("main.plotnumberofmembersperworld",{
//            url: "/plotnumberofmembersperworld",
            views: {
                'areastacked@main': {
                    templateUrl: 'views/areastackedchart.html',
                    controller: 'generateNumberOfMembersPerWorldforAreaStackedController'
                }
            }
        })

        .state("main.plotaveragelatency",{
//            url: "/plotaveragelatency",
            views: {
                'areastacked@main': {
                    templateUrl: 'views/areastackedchart.html',
                    controller: 'generateAverageLatencyforAreaStackedController'
                }
            }
        })

// Routes for Plotting Hourly
        .state("main.plothourly",{
//            url: "/plothourly",
            views: {
                'hourlychartuiview@main': {
                    templateUrl: 'views/durationchart.html',
                    controller: 'generateTotalBytesUsedHourlyController'
                }
            }
        })


        .state("main.addmessage",{
//            url: "/addmessage",
            views: {
                'performance-ui-view@main': {
                    templateUrl: 'views/redshifttemplate.html',
                    controller: 'postRedshiftDataController'
                }
            }
        })


        .state("main.select2.summary",{ // For one user/tenant
//            url: "/select2summary/:resourceId",
//            views: {
//                'performance-ui-view@main': {
                    templateUrl: 'views/userdevicesmembers.html',
                    controller: 'getOneCockpitUserController'
//                }
//            }
        })
        .state("main.plotgraph", {
//            url: '/:action/',
            views: {
                'performance-ui-view@main': {
                    templateUrl: 'views/demo.html',
                    controller: 'DemoCtrl'
                }
            }
        })
        .state("main.plotgraph.display", {
//            url: '/displaygraph',
            templateUrl: 'views/chartview.html'
        })
        .state("main.plotgraphname", {
//            url: '/:action/:name',
            views: {
                'performance-ui-view@main': {
                    templateUrl: 'views/demo.html',
                    controller: 'DemoCtrl'
                }
            }
        })
        .state("main.aggregate",{
//            url: "/aggregate",
            views: {
                'performance-ui-view@main': {
                    templateUrl: 'views/performancedynamictab.html',
                    controller: 'ListCtrl'
                }
            }
        })

        .state("main.aggregates", {
//            url: "/aggregates",
            templateUrl: 'views/aggregate.html'
        })

        .state("main.billing", {
//            url: "/billing",
            templateUrl: 'views/billing.html'
        })

        .state("main.tsupport", {
//            url: "/support",
            templateUrl: 'views/support.html'
        })

        .state("main.tenants", {
//            url: "/tenants",
            templateUrl: 'views/tenants.html'
        })

        .state("main.usersmanagement", {
//            url: "/usersmanagement",
            templateUrl: 'views/users.html'
        })

        .state("main.devices", {
//            url: "/devices",
            templateUrl: 'views/devices.html'
        })

        .state("main.about", {
//            url: "/about",
            templateUrl: 'views/about.html'
        })

        .state("main.contactus", {
//            url: "/contactus",
            templateUrl: 'views/contactus.html'
        })

//        .state("main.summary", {
//            url: "/summary",
//            templateUrl: 'views/summary.html'
//        })

//        .state("main.list", {
//            url: "/list",
//            controller: ListCtrl,
////            templateUrl: 'list.html' // use this if using cache template
//            templateUrl: 'views/usertenants.html'
//        })

//        This is for non-multiple-named-views
        .state("main.edit", {
//            url: "/edit/:projectId",
            controller: 'EditCtrl',
            templateUrl: 'views/detail.html',
            resolve: {
                project: function(Restangular,  $stateParams){
                    console.log($stateParams.projectId);
                    return true;
                   // return Restangular.one('projects', $stateParams.projectId).get();
                }
            }
        })


// To drill down more on device or members
        .state("main.select2.summary.devices", {
//            url: "/detaileddevices",
            controller: 'getAllDevicesCtrl',
            templateUrl: 'views/devices.html'
        })
        .state("main.select2.summary.members", {
//            url: "/detailedmembers",
            controller: 'getAllMembersCtrl',
            templateUrl: 'views/members.html'
        })

        .state("main.new", {
//            url: "/new",
            controller: 'CreateCtrl',
            templateUrl: 'views/detail.html'
        })

        /* This will target specific ui-view called performance-ui-view */
        .state("main.list", {
//            url: "/list",
            views: {
                'performance-ui-view@main': {
                    templateUrl: 'views/performancetab.html',
                    controller: 'ListCtrl'
                }
            }
        })
        .state("main.monthly", {
//            url: "/monthly",
            views: {
                'performance-ui-view@main': {
                    templateUrl: 'views/monthly.html' //,
//                    controller: 'MonthDurationCtrl'
                }
            }
        })
        .state("main.hourly",{
//            url: "/hourly",
            views: {
                'performance-ui-view@main': {
                    templateUrl: 'views/hourly.html' // ,
//                    controller: 'HourDurationCtrl' // I commented this out because it's already in ng-controller. It was being called twice
                }
            }
        })
// Cassandra
        .state("main.monthlycassandra", {
//            url: "/monthlycassandra",
            views: {
                'performance-ui-view@main': {
                    templateUrl: 'views/monthlycassandra.html'
                }
            }
        })
        // Below is when Odometer on the left navigation is clicked
        .state("main.odometer", {
            views: {
                'performance-ui-view@main': {
                    templateUrl: 'views/odometer.html'
                }
            }
        })
        // Below is when Odometer on the left navigation is clicked
        .state("main.gd", {
            views: {
                'performance-ui-view@main': {
                    templateUrl: 'views/gdreport.html'
                }
            }
        })
        .state("main.monthlycassandra.dcassandra", {
//            url: "/dcassandra/:udi",
//            url: "/a/b/c/dcassandra?udi",
//            url: "/microtime/:microtime",
            views: {
                'cassandrachart@main.monthlycassandra' : {
                    templateUrl: 'views/dailyudichart.html',
                    controller: 'resolveDailyCassandraChartController'
                }
            }//,
//            resolve: {
//
//                propertyData: function(CassandraRestangular,  $stateParams, $q, DeviceUDIFactory) {
//                    console.log("pulling deviceUDI from DeviceUDIFactory .....");
//
//                    var dataLoader = DeviceUDIFactory.getJsonData();
//                    console.log(dataLoader);
//                    dataLoader.then(function(data) {
//                        deviceUDI = data;
//                        console.log("jsonData: ", deviceUDI);
//                        return deviceUDI;
//                    }).then(function(data){
//                            console.log("second Promise: ", data);
//                            var deferred = $q.defer();
//                            CassandraRestangular.all("daily").getList({udi : data}).then(function(response) {
//                                deferred.resolve(response);
//                            })
//                            return deferred.promise;
//                        })
//
////
////                    var deferred = $q.defer();
////                    if (typeof $stateParams.udi === 'undefined') {
////                        CassandraRestangular.all("daily").getList({udi : window.deviceModel}).then(function(response) {
////                        deferred.resolve(response);
////                    })
////                    } else {
////                        CassandraRestangular.all("daily").getList({udi : $stateParams.udi}).then(function(response) {
////                            deferred.resolve(response);
////                        })
////                    }
////                    return deferred.promise;
//                }
//            }
        })


////        This is for multiple-named-views. It's the child of main.report 'report-ui-view'
//        .state("main.report.edit", {
//            views : {
//                'editview' : {
//                    url: "/edit/:projectId",
//                    controller: EditCtrl,
//                    templateUrl: 'detail.html',
//                    resolve: {
//                        project: function(Restangular,  $stateParams){
//                            return Restangular.one('projects', $stateParams.projectId).get();
//                        }
//                    }
//                }
//            }
//        })

        .state("main.aggregatev32", {
            views : {
                'activitystream-ui-view' : {
                    templateUrl: 'views/aggregate.html'
                }
            }
        })

        .state("newactivitystream", {
            views: {
                'activitystream-ui-view' : {
                    templateUrl: 'views/activitystream.html'
                }
            }
        })
        .state("main.report", {
            views: {
                'report-ui-view' : {
                    controller: 'ListCtrl',
                    templateUrl: 'list.html'
                }
            }
        })
  }])

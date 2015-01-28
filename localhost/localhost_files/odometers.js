cockpitApp.controller('OdometerCtrl', [
    'OdometerRestFactory',
    '$scope',
    '$state',
    '$rootScope',
    '$http',
    '$filter',
    '$timeout',
    'SocketDispatcher',
    'User',
    '$locale',
    'tmhDynamicLocale',
    'BaamApiEndpoints',
    'TimezoneFactory',
    'ZatarTokenService',
    'RFIDPropertyMap',
    'NonRFIDPropertyMap',
    'PrinterModels',
    'AvatarCollectionFactory',
    'Json2GCFactory',
    'AvatarIdMapFactory',
    function(
        OdometerRestFactory,
        $scope,
        $state,
        $rootScope,
        $http,
        $filter,
        $timeout,
        SocketDispatcher,
        User,
        $locale,
        tmhDynamicLocale,
        BaamApiEndpoints,
        TimezoneFactory,
        ZatarTokenService,
        RFIDPropertyMap,
        NonRFIDPropertyMap,
        PrinterModels,
        AvatarCollectionFactory,
        Json2GCFactory,
        AvatarIdMapFactory
        ) {
        if ( User.isAuthenticated() ) {

            var specFuncs = new Baam.SpecFuncs();

            try {

                $rootScope.dt = undefined;
                $rootScope.activeDate = undefined;

                $scope.avatarIdLocalStorage = JSON.parse(window.localStorage.getItem('avatarIdCollection'));
                $scope.avatarIdCheck = true;
                $scope.currentGrouping =  'device';
                $scope.flashEnabled = false;
                $scope.disableDropdown = false;

                $scope.avatarDropDownBlack = true;
                $scope.avatarDropDownGray = false;
                delete $scope.avatarIdMapping;

                $scope.queryStringParams = JSON.parse(window.localStorage.getItem('queryStringParams'));
                if ($scope.queryStringParams) {
                    var mode = $scope.queryStringParams.mode;
                    $scope.modeMonthOrDay = mode.toLowerCase().substring(0,1).toUpperCase()+mode.substring(1);

                    // Extract startdate
                    var year = parseInt($scope.queryStringParams.startdate.split('-')[0]);
                    var month = parseInt($scope.queryStringParams.startdate.split('-')[1]-1);
                    var day = parseInt($scope.queryStringParams.startdate.split('-')[2]);
                    $rootScope.dt = new Date(year, month, day);
                    $scope.chosenDate = $filter('date')($rootScope.dt, 'yyyy-MM-dd');
                    $rootScope.activeDate = $scope.chosenDate;

                    // Extract enddate
                    $scope.dateFromLocalStorage = false;
                    if ($scope.queryStringParams.enddate) {
                        $scope.endDateExt = $scope.queryStringParams.enddate;
                        $scope.dateFromLocalStorage = true;
                    }

                }

                if ( !$scope.avatarIdLocalStorage || !$scope.queryStringParams ) {
                    window.localStorage.removeItem('avatarIdCollection');
                    window.localStorage.removeItem('queryStringParams');
                    $scope.avatarIdLocalStorage = undefined;
                    $scope.queryStringParams = undefined;
                    $scope.endDateExt = undefined;
                    $scope.avatarIdCheck = false;
                    deleteAvatarIdList();
                }

            }

            catch(err) {
                $scope.avatarIdLocalStorage = undefined;
                $scope.queryStringParams = undefined;
                $scope.avatarIdCheck = false;
            }

            $scope.displayError = function(err) {
                $rootScope.modalDialogs.loadingSpinner = false;
                if (err.status != '401') {
                    $rootScope.modalDialogs.unknownError = true;
                }
                if (err.data == "") {
                    $rootScope.modalDialogs.serverError = "No response was received from the server. Possible Gateway Timeout issue [504 GATEWAY TIMEOUT]";
                } else
                if (err.status != '401') {
                    $rootScope.modalDialogs.serverError = err.data;
                }
            }

            function disableMenus(flag) {
                if (flag) {
                    $scope.disableCalendar = true;
                    $scope.disableButtons = true;
                } else {
                    $scope.disableCalendar = false;
                    $scope.disableButtons = false;
                }
            }

            function unSelectAvatarIdList() {
                $scope.avatarIdCheck = false;
                _.transform($scope.avatarIdDeviceCollection, function(result, avatar, key) {
                    avatar.ticked = false;
                    result[key] = avatar;
                });
            }

            function deleteAvatarIdList() {
                window.localStorage.removeItem('avatarIdCollection');
                window.localStorage.removeItem('queryStringParams');
                delete $scope.avatarIdLocalStorage;
                delete $scope.queryStringParams;
            }

            $scope.tz = TimezoneFactory;

            $rootScope.modalDialogs = {
                loadingSpinner  : false,
                tokenExpired    : false,
                resourceNotFound  : false,
                deviceSelection : false,
                invalidWeekRange : false,
                moreThan30  : false
            };

            var userData = User.getUserData();
            OdometerRestFactory.setBaseUrl(BaamApiEndpoints.DataService);
            OdometerRestFactory.setDefaultRequestParams({ userresourceid : userData.resourceId, tokenresourceid : userData.tokenResourceId, token: userData.bearerToken });

            disableMenus(true);
            ZatarTokenService.one('worlds').customGET('', { 'token' : userData.bearerToken }).then(function(res) {
                function retrieveOwnerHref(data, resourceId) {
                    var avatarOwner = _.find(data, function(obj) { if (obj.owner.indexOf(resourceId) != -1) return obj.owner } )
                    return avatarOwner.href;
                }

                $scope.ownerHref = retrieveOwnerHref(res, userData.resourceId);

                $scope.deviceLoader =  AvatarCollectionFactory.getDeviceIdListing($scope.ownerHref);
                $scope.deviceLoader.then(function(avatarIds) {
                    return(avatarIds)
                })
                    .then(function(avatarIds) {
                        OdometerRestFactory.one('devices', 'odometers').getList('modelnames', {
                            subtype : '' // retrieve all
                        }).then(function(models) {
                                return { models : models, avatarIds : avatarIds };
                            }, function(err) {
                                disableMenus(false);
                                $scope.displayError(err);
                            })
                            .then(function(modelsAvatarIds) {
                                $scope.modelNames = modelsAvatarIds.models[0].modelNames;
                                $scope.avatarIDCollection = modelsAvatarIds.avatarIds.deviceIds;
                                $scope.avatarIdMapping = _.chain(modelsAvatarIds.avatarIds.deviceIds)
                                    .groupBy('avatarId')
                                    .value();
                                $scope.avatarIdListing = AvatarIdMapFactory;
                                $scope.avatarIdListing.idListing =  $scope.avatarIdMapping;
                                $scope.avatarIdDeviceCollection = [];
                                $scope.avatarIDCollection.forEach(function(avatarId) {
                                    if ( $scope.avatarIdLocalStorage && $scope.queryStringParams ) {
                                        $scope.avatarIdCheck = true;
                                        $scope.avatarIdDeviceCollection.push( { 'icon' : '<img src="assets/img/printer.png">', checkboxDisabled: false, 'id' :  avatarId.avatarId, 'model' : avatarId.sysPrefix, 'displayName' : avatarId.name.length > 0 ? $filter("toEllipsis")(avatarId.name, 50) : Json2GCFactory.retrieveProperModelName(avatarId.sysPrefix) + ' - ' + avatarId.serialNumber, 'name' : avatarId.name.length > 0 ? 'top' + avatarId.name  : Json2GCFactory.retrieveProperModelName(avatarId.sysPrefix) + ' - ' + avatarId.serialNumber, 'serialNumber' : avatarId.serialNumber, ticked : $scope.avatarIdLocalStorage.avatarIds.indexOf(avatarId.avatarId) != -1 ? true : false, location : avatarId.location, type : avatarId.type } );
                                    } else {
                                        $scope.avatarIdDeviceCollection.push( { 'icon' : '<img src="assets/img/printer.png">', checkboxDisabled: false, 'id' :  avatarId.avatarId, 'model' : avatarId.sysPrefix, 'displayName' : avatarId.name.length > 0 ? $filter("toEllipsis")(avatarId.name, 50) : Json2GCFactory.retrieveProperModelName(avatarId.sysPrefix) + ' - ' + avatarId.serialNumber, 'name' : avatarId.name.length > 0 ? 'bottom' + avatarId.name : Json2GCFactory.retrieveProperModelName(avatarId.sysPrefix) + ' - ' + avatarId.serialNumber, 'serialNumber' : avatarId.serialNumber, ticked : false, location : avatarId.location, type : avatarId.type } );
                                    }
                                })

                                if ( !$scope.avatarIdLocalStorage || !$scope.queryStringParams ) { // $scope.avatarIdLocalStorage == undefined || $scope.queryStringParams == undefined
                                    $scope.execMonthly();
                                }

                                $scope.watchAvatarIdDeviceCollection();
                            })
                            .then(function(){
                                OdometerRestFactory.one('devices', 'odometers').getList('modelnames', {
                                    subtype : 'rfid'
                                }).then(function(rfidModels) {
                                        $scope.rfidModels = rfidModels[0].modelNames;
                                }, function(err) {
                                        disableMenus(false);
                                        $scope.displayError(err);
                                })
                            })
                    })
            }, function(err) {
                disableMenus(false);
                $scope.displayError(err);
            })

            $scope.hourNum = -1;
            $scope.chartColors = window.GoogleCharts.chartProperties.colors;
            $scope.weekNum = 0;
            var color = 0;

            $scope.seriesSelected = function (selectedItem, index) {
                if ( selectedItem ) {
                    var col = selectedItem.column;

                    if ( selectedItem.row ) {
                        var row = selectedItem.row;
                        console.log("col, row :", col, row);
                        console.log($scope.deviceModel[index].chart.data.rows[row].c[col].f);
                    }
                }
            };

//        ***********************************************************************
//        TODO: Keeping this code for now. It's for realtime sockets programming
//        ***********************************************************************
//            $scope.dataSocketLoader = SocketDispatcher.getJsonData();
//            $scope.dataSocketLoader.then(function(data) {
//                $scope.jsonData = data;
//                console.log('retrieved data via sockets ....');
//                console.log(data);
//        //        $scope.bigstackedchart = plotStackedColumnChartTemplateForGoogleCharts($scope.jsonData, 'Total Bytes Used Aggregated by World (Received/Sent)', 'user_name', 'totalbytesent', 'totalbytesreceived', 'totalbytes' ); // totalbytes should never be included in stacked column, just added it to make chart beautiful, LOL
//                $scope.$watch('jsonData', function(newValue, oldValue) {
//                    if ( newValue === oldValue) {
//                        return;
//                    }
//                    console.log('new data from sockets ....');
//                    console.log($scope.jsonData);
//        //            $scope.bigstackedchart = plotStackedColumnChartTemplateForGoogleCharts($scope.jsonData, 'Total Bytes Used Aggregated by World (Received/Sent)', 'user_name', 'totalbytesent', 'totalbytesreceived' , 'totalbytes'); // totalbytes should never be included in stacked column, just added it to make chart beautiful, LOL
//                }, true);
//            });
//
//            $rootScope.primus.on('hourlydata', function received(data) {
//
//        $rootScope.primus.on('event-name', function(data) {
//            console.log('event-name : ', data);
//            $rootScope.primus.emit('custom-event', { baam: 'baam-value' }, 1, 'baam');
//        });
//
//        $rootScope.primus.on('serverdata', function(arg) {
//            console.log('serverdata: ', arg);
//        });
//
//        $rootScope.primus.on('hdata', function(data) {
//            //        console.log('hdata');
//            //        console.log(data);
//            $scope.jsonData = data;
//            $scope.$apply();
//        });

//        $scope.$watch('jsonData', function (newValue, oldValue) {
//            if ( newValue === oldValue) {
//                return;
//            }
//            $scope.hourlychart = plotHourlyChartForGoogleCharts($scope.jsonData, 'Hourly Total Usage of Devices', 'companyname', 'devicename', 'starttime', 'endtime', 'totalBytesIn', 'totalBytesOut');
//            //        return $scope.jsonData;
//        }, true);

            $scope.plotRfid = function(plotterFunction, data, grouping, samplingRate, startDateTime, totalCols, isStacked, chartType, legendPosition, interpolate, isCustom) {

                if (grouping == 'model') {
                    grpObj = { k1 : 'deviceModels', k2 : 'deviceModel' }
                } else if (grouping == 'location') {
                    grpObj = { k1 : 'locations', k2 : 'location' }
                }

                $scope.deviceModel = Json2GCFactory.convertJsontoGoogleChartData(plotterFunction, data, grpObj.k1, grpObj.k2, samplingRate, startDateTime, totalCols, RFIDPropertyMap, isStacked, chartType, legendPosition, interpolate, isCustom);
            }

            $scope.clearGraph = function() {
                $scope.deviceModel = undefined;
            }

            $scope.loadMonthlyError = function(err) {
                if (err.data == "") {
                    $rootScope.modalDialogs.loadingSpinner = false;
                    $rootScope.modalDialogs.unknownError = true;
                    $rootScope.modalDialogs.serverError = "No response was received from the server. Possible Gateway Timeout issue [504 GATEWAY TIMEOUT]";
                } else
                if (err.status != '401') {
                    $rootScope.modalDialogs.loadingSpinner = false;
                    $rootScope.modalDialogs.unknownError = true;
                    $rootScope.modalDialogs.serverError = err.data;
                }
            }

            $scope.loadMonthly = function(groupBy, method) {
                if ($scope.printerType == 'standard' || $scope.printerType == '') {
                    var splitCurrentDate = $rootScope.activeDate.split('-');
                    var totalDaysGivenMonth = specFuncs.getDaysInMonth(parseInt(splitCurrentDate[1]), parseInt(splitCurrentDate[0]));
                    var yearMonth = splitCurrentDate[0]+'-' + specFuncs.pad(splitCurrentDate[1]);
                    var startdate = yearMonth + '-01';
                    var enddate = yearMonth + '-' + specFuncs.pad(parseInt(totalDaysGivenMonth));

                    $scope.csvStartDate = startdate;
                    $scope.csvEndDate = enddate;
                    $scope.csvPath = 'months';
                    $rootScope.path = $scope.csvPath;

                    if ( $scope.modeMonthOrDay == 'Month' ) {
                        if ( $scope.weekNum == 0 ) {
                            $rootScope.modalDialogs.loadingSpinner = true;

                            if (method == 'GET') {
                                disableMenus(true);
                                OdometerRestFactory.one('reports', 'odometers').getList('months', {
                                    startdate  : yearMonth,
                                    enddate : yearMonth,
                                    groupby : groupBy,
                                    sort : 'asc',
                                    subtype : $scope.printerType,
                                    timezone : $scope.tz.timeZone
                                })
                                    .then(function(data) {
                                        $rootScope.modalDialogs.loadingSpinner = false;
                                        disableMenus(false);
                                        if ( data.length == 0 ) {
                                            $rootScope.modalDialogs.resourceNotFound = true;
                                            $scope.clearGraph();
                                        } else {
                                            $scope.dateForGraph = $filter('date')($rootScope.dt, 'MMMM yyyy');

                                            if ( groupBy == 'model' ) {
                                                $scope.deviceModel = Json2GCFactory.generateMonthlyGraphObject(plotMonthlyNoWeekly_Lodash, data, 'deviceModels', 'deviceModel', 'month', startdate, enddate, totalDaysGivenMonth);
                                            } else {
                                                $scope.deviceModel = Json2GCFactory.generateMonthlyGraphObject(plotMonthlyNoWeekly_Lodash, data, 'locations', 'location', 'month', startdate, enddate, totalDaysGivenMonth);
                                            }
                                        }
                                    }, function(err) {
                                        disableMenus(false);
                                        $scope.displayError(err);
                                    });
                            } else if (method == 'POST') {

                                splitCurrentDate = $scope.endDateExt.split('-');
                                var totalDaysGivenMonth = specFuncs.getDaysInMonth(parseInt(splitCurrentDate[1]), parseInt(splitCurrentDate[0]));
                                endTime = splitCurrentDate[0] + '-' + splitCurrentDate[1] + '-' + specFuncs.pad(parseInt(totalDaysGivenMonth));
                                $scope.avatarIdLocalStorage = JSON.parse(window.localStorage.getItem('avatarIdCollection'));
                                $scope.csvStartDate = startdate;
                                $scope.csvEndDate = endTime;

                                if (groupBy == 'model' || groupBy == 'location') {
                                    $scope.csvPath = 'months';
                                    $rootScope.path = $scope.csvPath;
                                    path = 'months';
                                    payload = {
                                        startdate : startdate,
                                        enddate : endTime,
                                        groupby : groupBy,
                                        sort : 'asc',
                                        subtype : $scope.printerType,
                                        timezone : $scope.tz.timeZone
                                    }
                                } else if (groupBy == 'device') {
                                    $scope.csvPath = 'days';
                                    $rootScope.path = $scope.csvPath;
                                    path = 'days';
                                    payload = {
                                        startdate : startdate,
                                        enddate : endTime,
                                        sort : 'asc',
                                        subtype : $scope.printerType,
                                        timezone : $scope.tz.timeZone
                                    }
                                };
                                disableMenus(true);
                                OdometerRestFactory.one('reports/odometers').customPOST( {
                                    "avatarIdCollection" : $scope.avatarIdLocalStorage.avatarIds
                                }, path, payload, { 'Accept' : 'application/json;charset=utf-8', 'Content-Type' : 'application/json' })
                                    .then(function(data) {
                                        disableMenus(false);
                                        $rootScope.modalDialogs.loadingSpinner = false;
                                        if ( data.length == 0 ) {
                                            $rootScope.modalDialogs.resourceNotFound = true;
                                            $scope.clearGraph();
                                        } else {
                                            if ($scope.avatarIdCheck) {
                                                $scope.dateForGraph = $filter('date')($rootScope.dt, 'MMMM yyyy');
                                                if ( groupBy == 'model' ) {
                                                    $scope.deviceModel = Json2GCFactory.generateMonthlyGraphObject(plotMonthlyNoWeekly_Lodash, data, 'deviceModels', 'deviceModel', 'month', startdate, enddate, totalDaysGivenMonth);
                                                } else if ( groupBy == 'location' ) {
                                                    $scope.deviceModel = Json2GCFactory.generateMonthlyGraphObject(plotMonthlyNoWeekly_Lodash, data, 'locations', 'location', 'month', startdate, enddate, totalDaysGivenMonth);
                                                } else if ( groupBy == 'device' ) {
                                                    $scope.deviceModel = Json2GCFactory.generateDailyGraphForSelectedAvatars(plotDateRange_Lodash, data, startdate, specFuncs.hourCount(endTime, startdate, 'days'), 'days', 'none');
                                                }
                                            }
                                        }
                                    }, function(err) {
                                        disableMenus(false);
                                        $scope.displayError(err);
                                    });
                            }
                        } else {
                            $scope.execDateRange();
                        }
                    } else if ( $scope.modeMonthOrDay == 'Day' || $scope.modeMonthOrDay == 'Custom' ) {
                        $scope.execDateRange();
                    }
                }
            };

            $scope.loadDateRange = function(groupBy, method) {

                if ($scope.printerType == 'standard' || $scope.printerType == '') {

                    var splitCurrentDate = undefined,
                        weeklyRange = undefined,
                        startHour = undefined,
                        endHour = undefined,
                        totalDaysGivenMonth;

                    if ( $scope.modeMonthOrDay == 'Month' ) {
                        if ( $scope.weekNum > 0 ) {
                            $rootScope.modalDialogs.loadingSpinner = true;
                            splitCurrentDate = $rootScope.activeDate.split('-');
                            totalDaysGivenMonth = specFuncs.getDaysInMonth(parseInt(splitCurrentDate[1]), parseInt(splitCurrentDate[0]));
                            weeklyRange =  specFuncs.generateWeekRange(parseInt(splitCurrentDate[0]), parseInt(splitCurrentDate[1]), $scope.weekNum);
                            $scope.csvStartDate = weeklyRange.startdate;
                            $scope.csvEndDate = weeklyRange.enddate;
                            $scope.csvPath = 'days';
                            $rootScope.path = $scope.csvPath;

                            if (weeklyRange) {
                            if (method == 'GET') {
                                disableMenus(true);
                                OdometerRestFactory.one('reports', 'odometers').getList('days', {
                                    startdate  : weeklyRange.startdate,
                                    enddate : weeklyRange.enddate,
                                    groupby : groupBy,
                                    sort : 'asc',
                                    subtype : $scope.printerType,
                                    timezone : $scope.tz.timeZone
                                }).then(function(data) {
                                        $rootScope.modalDialogs.loadingSpinner = false;
                                        disableMenus(false);
                                        if (data.length == 0) {
                                            $rootScope.modalDialogs.resourceNotFound = true;
                                            $scope.clearGraph();
                                        } else {
                                            $scope.dateForGraph = $filter('date')(weeklyRange.startdate, 'MMM dd, yyyy') + ' - ' + $filter('date')(weeklyRange.enddate, 'MMM dd, yyyy');
                                            $scope.deviceModel = [];

                                            if ( groupBy == 'model' ) {
                                                $scope.deviceModel = Json2GCFactory.convertJsontoGoogleChartData(plotWeekly_Lodash, data, 'deviceModels', 'deviceModel', 'weeks', weeklyRange.startdate, '', NonRFIDPropertyMap, false, 'ColumnChart', 'none', false);
                                            } else if ( groupBy == 'location' ) {
                                                $scope.deviceModel = Json2GCFactory.convertJsontoGoogleChartData(plotWeekly_Lodash, data, 'locations', 'location', 'weeks', weeklyRange.startdate, '', NonRFIDPropertyMap, false, 'ColumnChart', 'none', false);
                                            }
                                        }
                                    }, function(err) {
                                        disableMenus(false);
                                        $scope.displayError(err);
                                    });
                            } else if (method == 'POST') {
                                $scope.avatarIdLocalStorage = JSON.parse(window.localStorage.getItem('avatarIdCollection'));
                                $scope.csvPath = 'days';
                                $rootScope.path = $scope.csvPath;

                                if (groupBy == 'model' || groupBy == 'location') {
                                    payload = {
                                        startdate : weeklyRange.startdate,
                                        enddate : weeklyRange.enddate,
                                        groupby : groupBy,
                                        sort : 'asc',
                                        subtype : $scope.printerType,
                                        timezone : $scope.tz.timeZone
                                    }
                                } else if (groupBy == 'device') {
                                    payload = {
                                        startdate : weeklyRange.startdate,
                                        enddate : weeklyRange.enddate,
                                        sort : 'asc',
                                        subtype : $scope.printerType,
                                        timezone : $scope.tz.timeZone
                                    }
                                };

                                disableMenus(true);
                                OdometerRestFactory.one('reports/odometers').customPOST( {
                                    "avatarIdCollection" : $scope.avatarIdLocalStorage.avatarIds
                                }, 'days', payload, { 'Accept' : 'application/json;charset=utf-8', 'Content-Type' : 'application/json' })
                                    .then(function(data) {
                                        $rootScope.modalDialogs.loadingSpinner = false;
                                        disableMenus(false);
                                        if (data.length == 0) {
                                            $rootScope.modalDialogs.resourceNotFound = true;
                                            $scope.clearGraph();
                                        } else {
                                            if ($scope.avatarIdCheck) {
                                                $scope.dateForGraph = $filter('date')(weeklyRange.startdate, 'MMM dd, yyyy') + ' - ' + $filter('date')(weeklyRange.enddate, 'MMM dd, yyyy');
                                                $scope.deviceModel = [];
                                                if ( groupBy == 'model' ) {
                                                    $scope.deviceModel = Json2GCFactory.convertJsontoGoogleChartData(plotWeekly_Lodash, data, 'deviceModels', 'deviceModel', 'weeks', weeklyRange.startdate, '', NonRFIDPropertyMap, false, 'ColumnChart', 'none', false);
                                                } else if ( groupBy == 'location' ) {
                                                    $scope.deviceModel = Json2GCFactory.convertJsontoGoogleChartData(plotWeekly_Lodash, data, 'locations', 'location', 'weeks', weeklyRange.startdate, '', NonRFIDPropertyMap, false, 'ColumnChart', 'none', false);
                                                } else if ( groupBy == 'device' ) {
                                                    $scope.deviceModel = Json2GCFactory.generateDailyGraphForSelectedAvatars(plotDateRange_Lodash, data, weeklyRange.startdate, totalDaysGivenMonth, 'weeks', 'none');
                                                }
                                            }
                                        }
                                    }, function(err) {
                                        disableMenus(false);
                                        $scope.displayError(err);
                                    });
                            }
                            } else {
                                $rootScope.modalDialogs.loadingSpinner = false;
                                $rootScope.modalDialogs.invalidWeekRange = true;
                                $scope.clearGraph();
                            }
                        } else {
                            $scope.execMonthly();
                        }
                    } else if ( $scope.modeMonthOrDay == 'Day' ) {
                        if ( $scope.hourNum != -1 ) { // When an hour range is selected from the dropdown
                            $rootScope.modalDialogs.loadingSpinner = true;
                            splitCurrentDate = $rootScope.activeDate.split('-');
                            totalDaysGivenMonth = specFuncs.getDaysInMonth(parseInt(splitCurrentDate[1]), parseInt(splitCurrentDate[0]));
                            startHour = specFuncs.convertDateToUTC($rootScope.activeDate + $scope.twentyFourHourDuration[$scope.hourNum+1].hourStart);

                            if ( $scope.hourNum == 23 ) {
                                endHour = specFuncs.convertDateToUTC(specFuncs.add1Day(splitCurrentDate[0], splitCurrentDate[1], splitCurrentDate[2]) + ' 00:00:00');
                            } else {
                                endHour = specFuncs.convertDateToUTC($rootScope.activeDate + $scope.twentyFourHourDuration[$scope.hourNum+1].hourEnd);
                            }
                            $scope.csvStartDate = startHour;
                            $scope.csvEndDate = endHour;
                            $scope.csvPath = 'hours';
                            $rootScope.path = $scope.csvPath;

                            if (method == 'GET') {
                                disableMenus(true);
                                OdometerRestFactory.one('reports', 'odometers').getList('hours',{
                                    startdate  : startHour,
                                    enddate : endHour,
                                    groupby : groupBy,
                                    sort : 'asc',
                                    subtype : $scope.printerType
                                }).then(function(data) {
                                        $rootScope.modalDialogs.loadingSpinner = false;
                                        disableMenus(false);
                                        if ( data.length == 0 ) {
                                            $rootScope.modalDialogs.resourceNotFound = true;
                                            $scope.clearGraph();
                                        } else {
                                            $scope.dateForGraph = $filter('date')(startHour, 'MMM dd, yyyy hh:mm a') + ' - ' + $filter('date')(endHour, 'MMM dd, yyyy hh:mm a');
                                            $scope.deviceModel = [];

                                            if ( groupBy == 'model' ) {
                                                $scope.deviceModel = Json2GCFactory.generateHourlyGraphObject(plot1HourRange_Lodash, data, 'deviceModels', 'deviceModel');
                                            } else if ( groupBy == 'location' ) {
                                                $scope.deviceModel = Json2GCFactory.generateHourlyGraphObject(plot1HourRange_Lodash, data, 'locations', 'location');
                                            }
                                        }
                                    }, function(err) {
                                        disableMenus(false);
                                        $scope.displayError(err);
                                    });
                            } else if (method == 'POST') {
                                $scope.avatarIdLocalStorage = JSON.parse(window.localStorage.getItem('avatarIdCollection'));

                                if (groupBy == 'model' || groupBy == 'location') {
                                    payload = {
                                        startdate : startHour,
                                        enddate : endHour,
                                        groupby : groupBy,
                                        sort : 'asc',
                                        subtype : $scope.printerType
                                    }
                                } else if (groupBy == 'device') {
                                    payload = {
                                        startdate : startHour,
                                        enddate : endHour,
                                        sort : 'asc',
                                        subtype : $scope.printerType
                                    }
                                };

                                disableMenus(true);
                                OdometerRestFactory.one('reports/odometers').customPOST( {
                                    "avatarIdCollection" : $scope.avatarIdLocalStorage.avatarIds
                                }, 'hours', payload, { 'Accept' : 'application/json;charset=utf-8', 'Content-Type' : 'application/json' })
                                    .then(function(data) {
                                        $rootScope.modalDialogs.loadingSpinner = false;
                                        disableMenus(false);
                                        if ( data.length == 0 ) {
                                            $rootScope.modalDialogs.resourceNotFound = true;
                                            $scope.clearGraph();
                                        } else {
                                            if ($scope.avatarIdCheck) {
                                                $scope.dateForGraph = $filter('date')(startHour, 'MMM dd, yyyy hh:mm a') + ' - ' + $filter('date')(endHour, 'MMM dd, yyyy hh:mm a');
                                                if ( groupBy == 'model' ) {
                                                    $scope.deviceModel = Json2GCFactory.generateHourlyGraphObject(plot1HourRange_Lodash, data, 'deviceModels', 'deviceModel');
                                                } else if ( groupBy == 'location' ) {
                                                    $scope.deviceModel = Json2GCFactory.generateHourlyGraphObject(plot1HourRange_Lodash, data, 'locations', 'location');
                                                } else if ( groupBy == 'device' ) {
                                                    $scope.deviceModel = Json2GCFactory.generateDailyGraphForSelectedAvatars(plotDateRange_Lodash, data, specFuncs.convertDateToUTC($rootScope.activeDate + ' 00:00:00'), totalDaysGivenMonth, 'singlehour', 'none');
                                                }
                                            }
                                        }
                                    }, function(err) {
                                        disableMenus(false);
                                        $scope.displayError(err);
                                    });
                            }

                        } else if ( $scope.hourNum == -1 ) {
                            $rootScope.modalDialogs.loadingSpinner = true;
                            splitCurrentDate = $rootScope.activeDate.split('-');
                            totalDaysGivenMonth = specFuncs.getDaysInMonth(parseInt(splitCurrentDate[1]), parseInt(splitCurrentDate[0]));
                            var startDate = specFuncs.convertDateToUTC($rootScope.activeDate + ' 00:00:00');
                            endHour = specFuncs.convertDateToUTC(specFuncs.add1Day(splitCurrentDate[0], splitCurrentDate[1], splitCurrentDate[2]) + ' 00:00:00');
                            $scope.csvStartDate = startDate;
                            $scope.csvEndDate = endHour;
                            $scope.csvPath = 'hours';
                            $rootScope.path = $scope.csvPath;

                            if (method == 'GET') {
                                disableMenus(true);
                                OdometerRestFactory.one('reports', 'odometers').getList('hours',{
                                    startdate  : startDate,
                                    enddate : endHour,
                                    groupby : groupBy,
                                    sort : 'asc',
                                    subtype : $scope.printerType
                                }).then(function(data) {
                                        $rootScope.modalDialogs.loadingSpinner = false;
                                        disableMenus(false);
                                        if ( data.length == 0 ) {
                                            $rootScope.modalDialogs.resourceNotFound = true;
                                            $scope.clearGraph();
                                        } else {
                                            $scope.dateForGraph = $filter('date')(specFuncs.convertDateToUTC($rootScope.activeDate + ' 00:00:00'), 'MMM dd, yyyy hh:mm a') + ' - ' + $filter('date')(endHour, 'MMM dd, yyyy hh:mm a');
                                            $scope.deviceModel = [];
                                            if ( groupBy == 'model' ) {
                                                $scope.deviceModel = Json2GCFactory.convertJsontoGoogleChartData(plotHourly_Lodash, data, 'deviceModels', 'deviceModel', 'hours', startDate, specFuncs.hourCount(endHour, startDate, 'hours'), NonRFIDPropertyMap, false, 'AreaChart', 'none', true);
                                            } else if ( groupBy == 'location' ) {
                                                $scope.deviceModel = Json2GCFactory.convertJsontoGoogleChartData(plotHourly_Lodash, data, 'locations', 'location', 'hours', startDate, specFuncs.hourCount(endHour, startDate, 'hours'), NonRFIDPropertyMap, false, 'AreaChart', 'none', true);
                                            }
                                        }
                                    }, function(err) {
                                        disableMenus(false);
                                        $scope.displayError(err);
                                    });
                            } else if (method == 'POST') {
                                if (!$scope.dateFromLocalStorage) {
                                    $scope.endDateExt = $rootScope.activeDate;
                                }
                                splitCurrentDate = $scope.endDateExt.split('-');
                                startTime = specFuncs.convertDateToUTC($rootScope.activeDate + ' 00:00:00');
                                endTime = specFuncs.convertDateToUTC(specFuncs.add1Day(splitCurrentDate[0], splitCurrentDate[1], splitCurrentDate[2]) + ' 00:00:00');
                                $scope.avatarIdLocalStorage = JSON.parse(window.localStorage.getItem('avatarIdCollection'));
                                $scope.csvStartDate = startTime;
                                $scope.csvEndDate = endTime;
                                $scope.csvPath = 'hours';
                                $rootScope.path = $scope.csvPath;

                                if (groupBy == 'model' || groupBy == 'location') {
                                    payload = {
                                        startdate : startTime,
                                        enddate : endTime,
                                        groupby : groupBy,
                                        sort : 'asc',
                                        subtype : $scope.printerType
                                    }
                                } else if (groupBy == 'device') {
                                    payload = {
                                        startdate : startTime,
                                        enddate : endTime,
                                        sort : 'asc',
                                        subtype : $scope.printerType
                                    }
                                };

                                disableMenus(true);
                                OdometerRestFactory.one('reports/odometers').customPOST( {
                                    "avatarIdCollection" : $scope.avatarIdLocalStorage.avatarIds
                                }, 'hours', payload, { 'Accept' : 'application/json;charset=utf-8', 'Content-Type' : 'application/json' })

                                    .then(function(data) {
                                        $rootScope.modalDialogs.loadingSpinner = false;
                                        disableMenus(false);
                                        if ( data.length == 0 ) {
                                            $rootScope.modalDialogs.resourceNotFound = true;
                                            $scope.clearGraph();
                                        } else {
                                            if ($scope.avatarIdCheck) {
                                                $scope.dateForGraph = $filter('date')(startTime, 'MMM dd, yyyy hh:mm a') + ' - ' + $filter('date')(endTime, 'MMM dd, yyyy hh:mm a');
                                                if ( groupBy == 'model' ) {
                                                    $scope.deviceModel = Json2GCFactory.convertJsontoGoogleChartData(plotHourly_Lodash, data, 'deviceModels', 'deviceModel', 'hours', startDate, specFuncs.hourCount(endHour, startDate, 'hours'), NonRFIDPropertyMap, false, 'AreaChart', 'none', true);
                                                } else if ( groupBy == 'location' ) {
                                                    $scope.deviceModel = Json2GCFactory.convertJsontoGoogleChartData(plotHourly_Lodash, data, 'locations', 'location', 'hours', startDate, specFuncs.hourCount(endHour, startDate, 'hours'), NonRFIDPropertyMap, false, 'AreaChart', 'none', true);
                                                } else if ( groupBy == 'device' ) {
                                                    $scope.deviceModel = Json2GCFactory.generateDailyGraphForSelectedAvatars(plotDateRange_Lodash, data, startTime, specFuncs.hourCount(endTime, startTime, 'hours'), 'hours', 'none');
                                                }
                                            }
                                        }
                                    }, function(err) {
                                        disableMenus(false);
                                        $scope.displayError(err);
                                    });
                            }

                        } else {
                            $scope.execDateRange();
                        }
                    } else if ( $scope.modeMonthOrDay == 'Custom' ) {
                        if (method == 'GET') {
                            $rootScope.modalDialogs.loadingSpinner = true;
                            var startDateTime = $rootScope.activeDate;
                            var endDateTime = $rootScope.activeEndDate;
                            path = 'days';
                            $scope.csvStartDate = startDateTime;
                            $scope.csvEndDate = endDateTime;
                            $scope.csvPath = path;
                            $rootScope.path = $scope.csvPath;
                            isStacked = false; // false we don't need to stack it

                            disableMenus(true);
                            OdometerRestFactory.one('reports', 'odometers').getList(path, {
                                startdate  : startDateTime,
                                enddate : endDateTime,
                                groupby : $scope.groupBy,
                                sort : 'asc',
                                subtype : '',
                                timezone : $scope.tz.timeZone
                            })
                                .then(function(data) {
                                    $rootScope.modalDialogs.loadingSpinner = false;
                                    disableMenus(false);
                                    if ( data.length == 0 ) {
                                        $rootScope.modalDialogs.resourceNotFound = true;
                                        $scope.clearGraph();
                                    } else {
                                        if ($scope.groupBy == 'model') {
                                            grpObj = { k1 : 'deviceModels', k2 : 'deviceModel' }
                                        } else if ($scope.groupBy == 'location') {
                                            grpObj = { k1 : 'locations', k2 : 'location' }
                                        }
                                        $scope.dateForGraph = $filter('date')(startDateTime, 'MMM dd, yyyy') + ' - ' + $filter('date')(endDateTime, 'MMM dd, yyyy');
                                        $scope.deviceModel = Json2GCFactory.convertJsontoGoogleChartData(plotDateRange_Lodash, data, grpObj.k1, grpObj.k2, path, startDateTime, specFuncs.hourCount(endDateTime, startDateTime, 'days'), NonRFIDPropertyMap, isStacked, 'ColumnChart', 'top', false, true);
                                    }
                                }, function(err) {
                                    disableMenus(false);
                                    $scope.clearGraph();
                                    $scope.displayError(err);
                                })
                        } else if (method == 'POST') {
                            $scope.avatarIdLocalStorage = JSON.parse(window.localStorage.getItem('avatarIdCollection'));
                            $rootScope.modalDialogs.loadingSpinner = true;
                            var startDateTime = $rootScope.activeDate;
                            var endDateTime = $rootScope.activeEndDate;
                            path = 'days';
                            $scope.csvStartDate = startDateTime;
                            $scope.csvEndDate = endDateTime;
                            $scope.csvPath = path;
                            $rootScope.path = $scope.csvPath;
                            isStacked = false; // false we don't need to stack it

                            if (groupBy == 'model' || groupBy == 'location') {
                                $scope.csvPath = 'days';
                                $rootScope.path = $scope.csvPath;
                                path = 'days';
                                payload = {
                                    startdate : startDateTime,
                                    enddate : endDateTime,
                                    groupby : groupBy,
                                    sort : 'asc',
                                    subtype : $scope.printerType,
                                    timezone : $scope.tz.timeZone
                                }
                            } else if (groupBy == 'device') {
                                $scope.csvPath = 'days';
                                $rootScope.path = $scope.csvPath;
                                path = 'days';
                                payload = {
                                    startdate : startDateTime,
                                    enddate : endDateTime,
                                    sort : 'asc',
                                    subtype : $scope.printerType,
                                    timezone : $scope.tz.timeZone
                                }
                            };
                            disableMenus(true);
                            OdometerRestFactory.one('reports/odometers').customPOST( {
                                "avatarIdCollection" : $scope.avatarIdLocalStorage.avatarIds
                            }, path, payload, { 'Accept' : 'application/json;charset=utf-8', 'Content-Type' : 'application/json' })
                                .then(function(data) {
                                    disableMenus(false);
                                    $rootScope.modalDialogs.loadingSpinner = false;
                                    if ( data.length == 0 ) {
                                        $rootScope.modalDialogs.resourceNotFound = true;
                                        $scope.clearGraph();
                                    } else {
                                        if ($scope.avatarIdCheck) {
                                            $scope.dateForGraph = $filter('date')($rootScope.dt, 'MMMM yyyy');
                                            if ($scope.groupBy == 'model') {
                                                grpObj = { k1 : 'deviceModels', k2 : 'deviceModel' }
                                            } else if ($scope.groupBy == 'location') {
                                                grpObj = { k1 : 'locations', k2 : 'location' }
                                            }
                                            $scope.dateForGraph = $filter('date')(startDateTime, 'MMM dd, yyyy') + ' - ' + $filter('date')(endDateTime, 'MMM dd, yyyy');
                                            if (groupBy == 'model' || groupBy == 'location') {
                                                $scope.deviceModel = Json2GCFactory.convertJsontoGoogleChartData(plotDateRange_Lodash, data, grpObj.k1, grpObj.k2, path, startDateTime, specFuncs.hourCount(endDateTime, startDateTime, 'days'), NonRFIDPropertyMap, isStacked, 'ColumnChart', 'top', false);
                                            } else if (groupBy == 'device') {
                                                $scope.deviceModel = Json2GCFactory.generateDailyGraphForSelectedAvatars(plotDateRange_Lodash, data, startDateTime, specFuncs.hourCount(endDateTime, startDateTime, 'days'), 'days', 'none');
                                            }
                                        }
                                    }
                                }, function(err) {
                                    disableMenus(false);
                                    $scope.clearGraph();
                                    $scope.displayError(err);
                                });
                        }
                    }
                }
            }

            // Generate 24 hour menu
            $scope.twentyFourHourDuration = [{ hourNum: -1,  name: "------", ticked : true }];
            for (var i=0; i < 24; i++) {
                if ( i == 12 ) {
                    $scope.twentyFourHourDuration.push({ hourNum : i, name : (i) +":00PM - " + (i+1-12) + ":00PM", hourStart : ' ' + specFuncs.pad(i, 2)+":00:00", hourEnd :  ' ' + specFuncs.pad(i+1, 2)+":00:00",  ticked : false })
                } else if ( i > 11 && i != 12 && i != 23 ) {
                    $scope.twentyFourHourDuration.push({ hourNum : i, name : (i-12) +":00PM - " + (i+1-12) + ":00PM", hourStart : ' ' + specFuncs.pad(i, 2)+":00:00", hourEnd :  ' ' + specFuncs.pad(i+1, 2)+":00:00",  ticked : false })
                } else if ( i < 12 && i != 11 && i != 0 ) {
                    $scope.twentyFourHourDuration.push({ hourNum : i, name : (i) +":00AM - " + (i+1) + ":00AM", hourStart : ' ' + specFuncs.pad(i, 2)+":00:00", hourEnd :  ' ' + specFuncs.pad(i+1, 2)+":00:00",  ticked : false })
                } else if ( i == 0 ) {
                    $scope.twentyFourHourDuration.push({ hourNum : i, name : (i+12) +":00AM - " + (i+1) + ":00AM", hourStart : ' ' + specFuncs.pad(i, 2)+":00:00", hourEnd :  ' ' + specFuncs.pad(i+1, 2)+":00:00",  ticked : false })
                } else if ( i == 11 ) {
                    $scope.twentyFourHourDuration.push({ hourNum : i, name : (i) +":00AM - " + (i+1) + ":00PM", hourStart : ' ' + specFuncs.pad(i, 2)+":00:00", hourEnd :  ' ' + specFuncs.pad(i+1, 2)+":00:00",  ticked : false })
                } else if ( i == 23 ) {
                    $scope.twentyFourHourDuration.push({ hourNum : i, name : (i-12) +":00PM - " + (i+1-12) + ":00AM", hourStart : ' ' + specFuncs.pad(i, 2)+":00:00", hourEnd :  ' ' + specFuncs.pad(i+1, 2)+":00:00",  ticked : false })
                }
            }

            $scope.grouping = [
                { 'mode' : 'model',    'groupingByText' : 'Model' },
                { 'mode' : 'location', 'groupingByText' : 'Location' },
                { 'mode' : 'device', 'groupingByText' : 'Device' }
            ]

            $scope.printerTypes = [
                { mode: '',  name: 'Inches Printed', ticked : false },
//                { mode: 'standard',  name: 'Standard - Inches Printed', ticked : false },
                { mode: 'rfid',     name: 'RFID Count - Valid/Fail', ticked : false}
            ]

            $scope.dayOrMonth = [
                { path : 'months', icon: '', name: 'Month', ticked: true },
                { path : 'days', icon: '', name: 'Day', ticked: false },
                { path : 'custom', icon: '', name: 'Custom', ticked: false }
            ]

            $scope.weeks = [
                { icon: '', name: '------', weekNum : 0, ticked: true },
                { icon: '', name: 'Week 1', weekNum : 1, ticked: false },
                { icon: '', name: 'Week 2', weekNum : 2, ticked: false },
                { icon: '', name: 'Week 3', weekNum : 3, ticked: false },
                { icon: '', name: 'Week 4', weekNum : 4, ticked: false },
                { icon: '', name: 'Week 5', weekNum : 5, ticked: false },
            ]

            $scope.execMonthly = function() {
                if ($scope.avatarIdCheck == true) {
                    $scope.loadMonthly($scope.currentGrouping, 'POST');
                }  else {
                    $scope.loadMonthly($scope.currentGrouping, 'GET');
                }
            }

            $scope.execDateRange = function() {
                if ($scope.avatarIdCheck == true) {
                    $scope.loadDateRange($scope.currentGrouping, 'POST');
                }  else {
                    $scope.loadDateRange($scope.currentGrouping, 'GET');
                }
            }

            function prepareDeviceDropdown() {

                if ($scope.printerType == 'rfid') {
                    var isRfid;

                    _.transform($scope.avatarIdDeviceCollection, function(result, avatar, key) {

                        isRfid = _.find($scope.rfidModels, function(obj) {
                            return obj.modelName.toLowerCase() == avatar.model.toLowerCase()
                        })

                        if (isRfid) {
                            avatar.checkboxDisabled = false;
                            result[key] = avatar;
                        } else {
                            avatar.checkboxDisabled = true;
                            result[key] = avatar;
                        }

                    });

                } else {
                    _.transform($scope.avatarIdDeviceCollection, function(result, avatar, key) {
                        avatar.checkboxDisabled = false;
                        result[key] = avatar;
                    });
                }
            }

            $scope.prepareRfid = function(dayormonth) {
                var isStacked;

                var endPoint = _.find($scope.dayOrMonth, function(obj) {
                    return obj.name == dayormonth
                })

                if ( endPoint ) {
                    if ( endPoint.path == 'months') {
                        // We'll grab 7 day range since it's a week
                        path = 'days';
                        if ($scope.weekNum > 0) {
                            var splitCurrentDate = $rootScope.activeDate.split('-');
                            weeklyRange =  specFuncs.generateWeekRange(parseInt(splitCurrentDate[0]), parseInt(splitCurrentDate[1]), $scope.weekNum);
                            if (weeklyRange) {
                                startDateTime = weeklyRange.startdate;
                                endDateTime = weeklyRange.enddate;
                                $scope.csvStartDate = startDateTime;
                                $scope.csvEndDate = endDateTime;
                                $scope.csvPath = path;
                                $rootScope.path = $scope.csvPath;
                                isStacked = true; // true because it's a Column Chart
                                $scope.dateForGraph = $filter('date')(startDateTime, 'MMM dd, yyyy') + ' - ' + $filter('date')(endDateTime, 'MMM dd, yyyy');
                            } else {
                                $rootScope.modalDialogs.invalidWeekRange = true;
                                $scope.clearGraph();
                                return;
                            }
                        } else {
                            $scope.dateForGraph = $filter('date')($rootScope.dt, 'MMMM yyyy');
                            if (!$scope.avatarIdCheck) {
                                var splitCurrentDate = $rootScope.activeDate.split('-');
                                var totalDaysGivenMonth = specFuncs.getDaysInMonth(parseInt(splitCurrentDate[1]), parseInt(splitCurrentDate[0]));
                                var yearMonth = splitCurrentDate[0]+'-' + specFuncs.pad(splitCurrentDate[1]);
                                var startDateTime = yearMonth + '-01'
                                var endDateTime = yearMonth + '-' + specFuncs.pad(parseInt(totalDaysGivenMonth))
                                $scope.csvStartDate = startDateTime;
                                $scope.csvEndDate = endDateTime;
                                $scope.csvPath = path;
                                $rootScope.path = $scope.csvPath;
                                isStacked = true; // true because it's a Column Chart
                            } else {
                                var splitCurrentDate = $scope.endDateExt.split('-');
                                var totalDaysGivenMonth = specFuncs.getDaysInMonth(parseInt(splitCurrentDate[1]), parseInt(splitCurrentDate[0]));
                                var yearMonth = splitCurrentDate[0]+'-' + specFuncs.pad(splitCurrentDate[1]);
                                var startDateTime = yearMonth + '-01'
                                var endDateTime = splitCurrentDate[0] + '-' + splitCurrentDate[1] + '-' + specFuncs.pad(parseInt(totalDaysGivenMonth));
                                $scope.csvStartDate = startDateTime;
                                $scope.csvEndDate = endDateTime;
                                $scope.csvPath = path;
                                $rootScope.path = $scope.csvPath;
                                isStacked = true; // true because it's a Column Chart
                                $scope.avatarIdLocalStorage = JSON.parse(window.localStorage.getItem('avatarIdCollection'));
                            }
                        }
                    } else if ( endPoint.path == 'days') {
                        // We'll grab hour range
                        path = 'hours'
                        // Let's check if an hour range like 1am-2am is selected. -1 means whole 24 hours
                        if ($scope.hourNum == -1) {
                            splitCurrentDate = $rootScope.activeDate.split('-');
                            totalDaysGivenMonth = specFuncs.getDaysInMonth(parseInt(splitCurrentDate[1]), parseInt(splitCurrentDate[0]));
                            var startDateTime = specFuncs.convertDateToUTC($rootScope.activeDate + ' 00:00:00');
                            var endDateTime = specFuncs.convertDateToUTC(specFuncs.add1Day(splitCurrentDate[0], splitCurrentDate[1], splitCurrentDate[2]) + ' 00:00:00');
                            $scope.csvStartDate = startDateTime;
                            $scope.csvEndDate = endDateTime;
                            $scope.csvPath = path;
                            $rootScope.path = $scope.csvPath;
                            isStacked = false; // false because it's a line/area Chart
                            $scope.dateForGraph = $filter('date')(specFuncs.convertDateToUTC($rootScope.activeDate + ' 00:00:00'), 'MMM dd, yyyy hh:mm a') + ' - ' + $filter('date')(endDateTime, 'MMM dd, yyyy hh:mm a');

                        } else {
                            splitCurrentDate = $rootScope.activeDate.split('-');
                            totalDaysGivenMonth = specFuncs.getDaysInMonth(parseInt(splitCurrentDate[1]), parseInt(splitCurrentDate[0]));
                            startDateTime = specFuncs.convertDateToUTC($rootScope.activeDate + $scope.twentyFourHourDuration[$scope.hourNum+1].hourStart);
                            if ( $scope.hourNum == 23 ) {
                                endDateTime = specFuncs.convertDateToUTC(specFuncs.add1Day(splitCurrentDate[0], splitCurrentDate[1], splitCurrentDate[2]) + ' 00:00:00');
                            } else {
                                endDateTime = specFuncs.convertDateToUTC($rootScope.activeDate + $scope.twentyFourHourDuration[$scope.hourNum+1].hourEnd);
                            }
                            $scope.csvStartDate = startDateTime;
                            $scope.csvEndDate = endDateTime;
                            $scope.csvPath = path;
                            $rootScope.path = $scope.csvPath;
                            isStacked = true; // true because it's a Column Chart
                            $scope.dateForGraph = $filter('date')(startDateTime, 'MMM dd, yyyy hh:mm a') + ' - ' + $filter('date')(endDateTime, 'MMM dd, yyyy hh:mm a');
                        }
                    } else if ( endPoint.path == 'custom' ) {
                         path = 'days';
                         if (!$scope.avatarIdCheck) {
                            var splitCurrentDate = $rootScope.activeDate.split('-');
                            var totalDaysGivenMonth = specFuncs.getDaysInMonth(parseInt(splitCurrentDate[1]), parseInt(splitCurrentDate[0]));
                            var yearMonth = splitCurrentDate[0]+'-' + specFuncs.pad(splitCurrentDate[1]);
                            //var startDateTime = yearMonth + '-01'
                            //var endDateTime = yearMonth + '-' + specFuncs.pad(parseInt(totalDaysGivenMonth))
                            var startDateTime = $rootScope.activeDate;
                            var endDateTime = $rootScope.activeEndDate;
                            $scope.csvStartDate = startDateTime;
                            $scope.csvEndDate = endDateTime;
                            $scope.csvPath = path;
                            $rootScope.path = $scope.csvPath;
                            isStacked = true; // true because it's a Column Chart
                         } else {
                            var splitCurrentDate = $scope.endDateExt.split('-');
                            var totalDaysGivenMonth = specFuncs.getDaysInMonth(parseInt(splitCurrentDate[1]), parseInt(splitCurrentDate[0]));
                            var yearMonth = splitCurrentDate[0]+'-' + specFuncs.pad(splitCurrentDate[1]);
                            //var startDateTime = yearMonth + '-01'
                            //var endDateTime = splitCurrentDate[0] + '-' + splitCurrentDate[1] + '-' + specFuncs.pad(parseInt(totalDaysGivenMonth));
                            var startDateTime = $rootScope.activeDate;
                            var endDateTime = $rootScope.activeEndDate;
                            $scope.csvStartDate = startDateTime;
                            $scope.csvEndDate = endDateTime;
                            $scope.csvPath = path;
                            $rootScope.path = $scope.csvPath;
                            isStacked = true; // true because it's a Column Chart
                            $scope.avatarIdLocalStorage = JSON.parse(window.localStorage.getItem('avatarIdCollection'));
                         }
                         $scope.dateForGraph = $filter('date')(startDateTime, 'MMM dd, yyyy') + ' - ' + $filter('date')(endDateTime, 'MMM dd, yyyy');
                    }
                }

                $rootScope.modalDialogs.loadingSpinner = true;

                if (!$scope.avatarIdCheck) {
                    disableMenus(true);
                    OdometerRestFactory.one('reports', 'odometers').getList(path, {
                        startdate  : startDateTime,
                        enddate : endDateTime,
                        groupby : $scope.groupBy,
                        sort : 'asc',
                        subtype : 'rfid',
                        timezone : $scope.tz.timeZone
                    })
                        .then(function(data) {
                            $rootScope.modalDialogs.loadingSpinner = false;
                            disableMenus(false);
                            if ( data.length == 0 ) {
                                $rootScope.modalDialogs.resourceNotFound = true;
                                $scope.clearGraph();
                            } else {
                                if (endPoint.path == 'months' && $scope.weekNum == 0) {
                                    $scope.plotRfid(plotDateRange_Lodash, data, $scope.groupBy, path, startDateTime, specFuncs.hourCount(endDateTime, startDateTime, path), isStacked, 'ColumnChart', 'top', false);
                                } else if (endPoint.path == 'custom' ) {
                                    $scope.plotRfid(plotDateRange_Lodash, data, $scope.groupBy, path, startDateTime, specFuncs.hourCount(endDateTime, startDateTime, path), isStacked, 'ColumnChart', 'top', false, true);
                                } else if (endPoint.path == 'months' && $scope.weekNum > 0) {
                                    $scope.plotRfid(plotWeekly_Lodash,    data, $scope.groupBy, 'weeks', startDateTime, '', isStacked, 'ColumnChart', 'top', false);
                                } else if ( endPoint.path == 'days' && $scope.hourNum == -1) {
                                    $scope.plotRfid(plotHourly_Lodash,    data, $scope.groupBy, path, startDateTime, specFuncs.hourCount(endDateTime, startDateTime, path), isStacked, 'AreaChart', 'top', true);
                                } else if ( endPoint.path == 'days' && $scope.hourNum !== -1) {
                                    $scope.plotRfid(plot1HourRange_Lodash,data, $scope.groupBy, path, startDateTime, specFuncs.hourCount(endDateTime, startDateTime, path), isStacked, 'ColumnChart', 'none', false);
                                }
                            }
                        }, function(err) {
                            disableMenus(false);
                            $scope.clearGraph();
                            $scope.displayError(err);
                        })
                } else {
                    // if avatarIds are checked. Code for when Device menu is selected
                    $scope.avatarIdLocalStorage = JSON.parse(window.localStorage.getItem('avatarIdCollection'));
                    if ($scope.currentGrouping == 'model' || $scope.currentGrouping == 'location') {
                        payload = {
                            startdate : startDateTime,
                            enddate : endDateTime,
                            groupby : $scope.currentGrouping,
                            sort : 'asc',
                            subtype : 'rfid',
                            timezone : $scope.tz.timeZone
                        }
                    } else if ($scope.currentGrouping == 'device') {
                        payload = {
                            startdate : startDateTime,
                            enddate : endDateTime,
                            sort : 'asc',
                            subtype : 'rfid',
                            timezone : $scope.tz.timeZone
                        }
                    };

                    disableMenus(true);
                    OdometerRestFactory.one('reports/odometers').customPOST( {
                        "avatarIdCollection" : $scope.avatarIdLocalStorage.avatarIds
                    }, path, payload, { 'Accept' : 'application/json;charset=utf-8', 'Content-Type' : 'application/json' })
                        .then(function(data) {
                            $rootScope.modalDialogs.loadingSpinner = false;
                            disableMenus(false);
                            if ( data.length == 0 ) {
                                $rootScope.modalDialogs.resourceNotFound = true;
                                $scope.clearGraph();
                            } else {
                                if ($scope.avatarIdCheck) {
                                    if ($scope.currentGrouping == 'model' || $scope.currentGrouping == 'location') {
                                        if (endPoint.path == 'months' && $scope.weekNum == 0) {
                                            $scope.plotRfid(plotDateRange_Lodash, data, $scope.groupBy, path, startDateTime, specFuncs.hourCount(endDateTime, startDateTime, path), isStacked, 'ColumnChart', 'top', false);
                                        } else if (endPoint.path == 'custom' ) {
                                            $scope.plotRfid(plotDateRange_Lodash, data, $scope.groupBy, path, startDateTime, specFuncs.hourCount(endDateTime, startDateTime, path), isStacked, 'ColumnChart', 'top', false, true);
                                        } else if (endPoint.path == 'months' && $scope.weekNum > 0) {
                                            $scope.plotRfid(plotWeekly_Lodash,    data, $scope.groupBy, 'weeks', startDateTime, '', isStacked, 'ColumnChart', 'top', false);
                                        } else if ( endPoint.path == 'days' && $scope.hourNum == -1) {
                                            $scope.plotRfid(plotHourly_Lodash,    data, $scope.groupBy, path, startDateTime, specFuncs.hourCount(endDateTime, startDateTime, path), isStacked, 'AreaChart', 'top', true);
                                        } else if ( endPoint.path == 'days' && $scope.hourNum !== -1) {
                                            $scope.plotRfid(plot1HourRange_Lodash,data, $scope.groupBy, path, startDateTime, specFuncs.hourCount(endDateTime, startDateTime, path), isStacked, 'ColumnChart', 'none', false);
                                        }
                                    } else {
                                        if ( endPoint.path == 'months' && $scope.weekNum == 0) {
                                            $scope.deviceModel = Json2GCFactory.generateDailyGraphForSelectedRFIDAvatars(plotDateRange_Lodash, data, startDateTime, specFuncs.hourCount(endDateTime, startDateTime, 'days'), 'days', true, 'ColumnChart', 'top');
                                        } else if (endPoint.path == 'custom' ) {
                                            $scope.deviceModel = Json2GCFactory.generateDailyGraphForSelectedRFIDAvatars(plotDateRange_Lodash, data, startDateTime, specFuncs.hourCount(endDateTime, startDateTime, 'days'), 'days', true, 'ColumnChart', 'top');
                                            //$scope.plotRfid(plotDateRange_Lodash, data, $scope.groupBy, path, startDateTime, specFuncs.hourCount(endDateTime, startDateTime, path), isStacked, 'ColumnChart', 'top', false);
                                        } else if ( endPoint.path == 'months' && $scope.weekNum > 0) {
                                            $scope.deviceModel = Json2GCFactory.generateDailyGraphForSelectedRFIDAvatars(plotDateRange_Lodash, data, startDateTime, specFuncs.hourCount(endDateTime, startDateTime, 'days'), 'weeks', true, 'ColumnChart', 'top');
                                        } else if ( endPoint.path == 'days' && $scope.hourNum == -1) {
                                            $scope.deviceModel = Json2GCFactory.generateDailyGraphForSelectedRFIDAvatars(plotDateRange_Lodash, data, startDateTime, specFuncs.hourCount(endDateTime, startDateTime, 'hours'), 'hours', false, 'AreaChart', 'top');
                                        } else if ( endPoint.path == 'days' && $scope.hourNum !== -1) {
                                            $scope.deviceModel = Json2GCFactory.generateDailyGraphForSelectedRFIDAvatars(plotDateRange_Lodash, data, startDateTime, specFuncs.hourCount(endDateTime, startDateTime, 'hours'), 'singlehour', true, 'ColumnChart', 'top');
                                        }
                                    }
                                }
                            }
                        }, function(err) {
                            disableMenus(false);
                            $scope.clearGraph();
                            $scope.displayError(err);
                        });
                }
            }

            $scope.selectedMonthorDay = function(dayormonth) {
                $scope.dateFromLocalStorage = false;
                if ($scope.modeMonthOrDay == dayormonth) {
                    return;
                }

                if ($scope.printerType == 'standard' || $scope.printerType == '') {
                    if ( $scope.avatarIdLocalStorage && $scope.queryStringParams ) {
                        $scope.queryStringParams.mode = dayormonth.toLowerCase();
                        window.localStorage.setItem('queryStringParams', JSON.stringify( $scope.queryStringParams ));
                    }

                    if ( $scope.modeMonthOrDay != dayormonth ) {
                        $scope.modeMonthOrDay = dayormonth;
                        if ( $scope.modeMonthOrDay == 'Month' ) {
                            $scope.formatMonth = $scope.formats[1];
                        } else if ( $scope.modeMonthOrDay == 'Day' || $scope.modeMonthOrDay == 'Custom' ) {
                            $scope.format = $scope.formats[2];
                        }
                        if ($scope.modeMonthOrDay != 'Custom') {
                            $scope.execDateRange();

                        } else {
                            $scope.calendarFlashEnabled = true;
                            $scope.today(true);
                            $scope.clearGraph();
                        }
                    }
                } else if ($scope.printerType == 'rfid') {
                    if ( $scope.avatarIdLocalStorage && $scope.queryStringParams ) {
                        $scope.queryStringParams.mode = dayormonth.toLowerCase();
                        window.localStorage.setItem('queryStringParams', JSON.stringify( $scope.queryStringParams ));
                    }

                    if ( $scope.modeMonthOrDay != dayormonth ) {
                        $scope.modeMonthOrDay = dayormonth;
                        if ( $scope.modeMonthOrDay == 'Month' ) {
                            $scope.formatMonth = $scope.formats[1];
                        } else if ( $scope.modeMonthOrDay == 'Day' || $scope.modeMonthOrDay == 'Custom' ) {
                            $scope.format = $scope.formats[2];
                        }
                        if ($scope.modeMonthOrDay != 'Custom') {
                            $scope.prepareRfid(dayormonth);
                        } else {
                            $scope.calendarFlashEnabled = true;
                            $scope.today(true);
                            $scope.clearGraph();
                        }
                    }
                }
            }

            $scope.selectedWeekRange = function(weekNum) {
                $scope.dateFromLocalStorage = false;
                if ($scope.printerType == 'standard' || $scope.printerType == '') {
                    if ( $scope.weekNum != weekNum ) {
                        $scope.weekNum = weekNum;
                        $scope.execDateRange();
                    }
                } else if ($scope.printerType == 'rfid') {
                    if ( $scope.weekNum != weekNum ) {
                        $scope.weekNum = weekNum;
                        $scope.prepareRfid('Month');
                    }
                }
            }

            $scope.selectedHourRange = function(hourNum) {
                $scope.dateFromLocalStorage = false;
                if ($scope.printerType == 'standard' || $scope.printerType == '') {
                    if ( $scope.hourNum != hourNum ) {
                        $scope.hourNum = hourNum;
                        $scope.execDateRange();
                    }
                } else if ($scope.printerType == 'rfid') {
                    if ( $scope.hourNum != hourNum ) {
                        $scope.hourNum = hourNum;
                        $scope.prepareRfid('Day');
                    }
                }
            }

            $scope.displaySelected = function(index) {
                console.log('$scope.displaySelected : ', index);
            }

            $scope.openIt = function($event) {
                console.log( 'multi-select: on-open $scope.openIt' , $event);
            }

            $scope.closedayOrMonth = function() {
                var MonthOrDay = $scope.dayOrMonth.filter(function(row) {
                    return row.ticked
                });
                $scope.modeMonthOrDay = MonthOrDay[0].name;
                if ( $scope.modeMonthOrDay == 'Month' ) {
                    $scope.formatMonth = $scope.formats[1];
                } else if ( $scope.modeMonthOrDay == 'Day' ) {
                    $scope.format = $scope.formats[2];
                }
                $scope.execDateRange();
            }

            $scope.displayWeekSelected = function() {

                var WeekNumber = $scope.weeks.filter(function(row) {
                    return row.ticked
                });

                $scope.weekNum = WeekNumber[0].weekNum;
                $scope.execDateRange();
            }

            $scope.displayHourSelected = function() {
                var HourNumber = $scope.twentyFourHourDuration.filter(function(row) {
                    return row.ticked
                });
                $scope.hourNum = HourNumber[0].hourNum;
                $scope.execDateRange();
            }

            $scope.retrieveCsvReport = function() {

                $scope.dateFromLocalStorage = false;
                if ($scope.disableCalendar) {
                    return;
                }

                $scope.closeEventStatus = function() {
                    if ($rootScope.csvRequestCollection.length == 0) {
                        $rootScope.rotate = false;
                        $rootScope.modalDialogs.generatingCsvReport = false;
                        $rootScope.modalDialogs.showReportDetails = false;
                    }
                }

                $rootScope.rotate = true;

                $rootScope.modalDialogs.loadingSpinner = true, payload = {};

                if ( $scope.avatarIdLocalStorage ) {
                    payload = $scope.avatarIdLocalStorage.avatarIds.length > 0 ? { "avatarIdCollection" : $scope.avatarIdLocalStorage.avatarIds } : {};
                } else {
                    payload = {}
                }

                OdometerRestFactory.one('csvexport').customPOST(payload, $scope.csvPath, { startdate : $scope.csvStartDate, enddate : $scope.csvEndDate, format : 'csv', timezone : $scope.tz.timeZone, subtype : $scope.printerType }, { 'Accept' : 'application/json;charset=utf-8', 'Content-Type' : 'application/json' }).then(function(data) {
                    OdometerRestFactory.all('csvexport').get($scope.csvPath, {
                        reportresourceid : $rootScope.downloadToken
                    }).then(function(csvdata) {
                            downloadCsvStream(csvdata, $rootScope.csvFilename);
                            $scope.foundIndex = _.findIndex($rootScope.csvRequestCollection, function(a) { return a.downloadToken == $rootScope.downloadToken });
                            $rootScope.csvRequestCollection.splice($scope.foundIndex, 1);
                            $rootScope.csvRequestCollectionCount = $rootScope.csvRequestCollection.length;
                            $scope.closeEventStatus();
                        }, function(err) {
                            $rootScope.modalDialogs.loadingSpinner = false;
                            if (err.data == "") {
                                $rootScope.modalDialogs.loadingSpinner = false;
                                $rootScope.modalDialogs.unknownError = true;
                                $rootScope.modalDialogs.serverError = "No response was received from the server. Possible Gateway Timeout issue [504 GATEWAY TIMEOUT]";
                            }
                            if ( err.status == 404 && err.data.message.indexOf('still being generated' ) == -1) {
                                $rootScope.modalDialogs.unknownError = true;
                                $rootScope.modalDialogs.serverError = err.data;
                            }
                            if ( err.status == 500 ) {
                                $rootScope.modalDialogs.unknownError = true;
                                $rootScope.modalDialogs.serverError = err.data;
                            }
                            console.log('The Reason for failure:', err);
                        })
                }, function(err) {
                    $scope.displayError(err);
                });
            }

            $scope.focus = function() {
                console.log( 'multi-select: on-focus' );
            }

            $scope.blur = function() {
                console.log( 'multi-select: on-blur' );
            }

            $scope.setOdometerPanel = function(printerType) {

                if ($scope.printerType == printerType) {
                    return;
                }

                $scope.printerType = printerType;
                prepareDeviceDropdown();
                $scope.printerTypes.forEach(function(obj) {
                    obj.ticked = false;
                    if (obj.mode == printerType) {
                        obj.ticked = true;
                    }
                });

                $scope.printerTypes.filter(function(obj) {
                    if (obj.ticked) {
                        $scope.printerTypeName = obj.name;
                    }
                });

                // Let's reset everytime we change printer type
                $scope.disableCalendar = false;
                $scope.flashEnabled = false;
                $scope.currentGrouping =  'model';
                $scope.groupBy = 'model';
                $scope.weekNum = 0;
                $scope.hourNum = -1;
                $scope.modeMonthOrDay = 'Month';
                $scope.formatMonth = $scope.formats[1];

                unSelectAvatarIdList();
                deleteAvatarIdList();

                if (printerType == 'rfid') {
                    if (!$scope.devicesSelectedPreviously) {
                        $scope.prepareRfid($scope.modeMonthOrDay);
                    }
                } else if (printerType == 'standard' || printerType == '') {
                    $scope.execMonthly();
                }
            }

            $scope.selectModelOrLocation = function(mode) {
                unSelectAvatarIdList();
                deleteAvatarIdList();
                $scope.dateFromLocalStorage = false;

                plotModelOrLocationChart = function() {
                    if ($scope.printerType == 'standard' || $scope.printerType == '') {
                        if (mode == 'model' || mode == 'location') {
                            $scope.disableCalendar = false;
                            $scope.currentGrouping = mode;
                            $scope.groupBy = $scope.currentGrouping;

                            $scope.avatarDropDownBlack = false;
                            $scope.avatarDropDownGray = true;
                            $scope.queryStringParams = undefined;
                            if (!$scope.devicesSelectedPreviously) {
                                if ( $scope.modeMonthOrDay == 'Month') {
                                    $scope.execMonthly();
                                } else if ( $scope.modeMonthOrDay == 'Day' || $scope.modeMonthOrDay == 'Custom' ) {
                                    $scope.execDateRange();
                                }
                            }
                        } else {
                            $scope.disableCalendar = true;
                            $scope.flashEnabled = true;
                            $scope.enablePullDown();
                            $scope.clearGraph();
                            $scope.currentGrouping = mode;

                            $scope.avatarDropDownBlack = true;
                            $scope.avatarDropDownGray = false;
                            $scope.endDateExt = $rootScope.activeDate;

                            $scope.queryStringParams = {
                                startdate : $rootScope.activeDate,
                                enddate : $rootScope.activeDate,
                                groupby : $scope.groupBy,
                                sort : 'asc',
                                mode : $scope.modeMonthOrDay.toLowerCase()
                            };
                            window.localStorage.setItem('queryStringParams', JSON.stringify( $scope.queryStringParams ));
                        }
                    } else if ($scope.printerType == 'rfid') {
                        if (mode == 'model' || mode == 'location') {
                            $scope.disableCalendar = false;
                            $scope.currentGrouping = mode;
                            $scope.groupBy = $scope.currentGrouping;
                            $scope.avatarDropDownBlack = false;
                            $scope.avatarDropDownGray = true;
                            $scope.queryStringParams = undefined;
                            if (!$scope.devicesSelectedPreviously) {
                                $scope.prepareRfid($scope.modeMonthOrDay)
                            }
                        } else {
                            $scope.disableCalendar = true;
                            $scope.flashEnabled = true;
                            $scope.enablePullDown();
                            $scope.clearGraph();
                            $scope.currentGrouping = mode;

                            $scope.avatarDropDownBlack = true;
                            $scope.avatarDropDownGray = false;
                            $scope.endDateExt = $rootScope.activeDate;

                            $scope.queryStringParams = {
                                startdate : $rootScope.activeDate,
                                enddate : $rootScope.activeDate,
                                groupby : $scope.groupBy,
                                sort : 'asc',
                                mode : $scope.modeMonthOrDay.toLowerCase()
                            };
                            window.localStorage.setItem('queryStringParams', JSON.stringify( $scope.queryStringParams ));
                        }
                    }
                }

                if ($scope.currentGrouping == mode) {
                    return;
                }

                if ($scope.modeMonthOrDay == 'Custom') {
                    if (specFuncs.hourCount($rootScope.activeEndDate, $rootScope.activeDate, 'days') > 30) {
                        $rootScope.modalDialogs.moreThan30 = true;
                    } else {
                        plotModelOrLocationChart();
                    }
                } else {
                    plotModelOrLocationChart();
                }

                $rootScope.continueGT30DaysModal = function() {
                    $rootScope.modalDialogs.moreThan30 = false;
                    plotModelOrLocationChart();
                }

                $rootScope.cancelGT30DaysModal = function() {
                    $rootScope.modalDialogs.moreThan30 = false;
                }
            }

            $scope.stopFlash = function(element) {
                switch (element) {
                    case 'dropdown' : $scope.flashEnabled = false; break;
                    case 'calendar' : $scope.calendarFlashEnabled = false; break;
                }
            }

            $scope.disablePullDown = function() {
                $scope.flashEnabled = false;
                $scope.disableDropdown = true;
            }

            $scope.enablePullDown = function() {
                $scope.flashEnabled = true;
                $scope.disableDropdown = false;
            }

            // Initialize the defaults
            $scope.dropdown = $scope.twentyFourHourDuration[0];
            $scope.printerTypeName = $scope.printerTypes[0].name;
            $scope.printerType = '';
            $scope.disableCalendar = false;
            $scope.csvStartDate = '';
            $scope.csvEndDate = '';
            $scope.model = {};
            var downloadCsvTimeout;

            if ( !$scope.avatarIdLocalStorage || !$scope.queryStringParams ) {
                $scope.currentGrouping =  'model';
                $scope.groupBy = 'model';
                $scope.avatarIdCheck = false;
                $scope.printerTypeName = $scope.printerTypes[0].name;
                $scope.printerType = ''; // All printer types
                $scope.modeMonthOrDay = 'Month'
                deleteAvatarIdList();
            }

            $scope.today = function(forceDate) {
                if ( !$rootScope.activeDate || forceDate) {
                    $rootScope.dt = new Date();
                    $rootScope.edt = $rootScope.dt;
                    $scope.chosenDate = $filter('date')($rootScope.dt, 'yyyy-MM-dd');
                    $rootScope.activeDate = $scope.chosenDate;
                    $rootScope.activeEndDate = $scope.chosenDate;
                    // For calendar end date's min
                    $rootScope.minCustomStartDate = moment($rootScope.activeDate).toDate();
                    // For calendar start date's max
                    $rootScope.maxCustomEndDate = moment($rootScope.activeEndDate).toDate();
                    // Let's add previous date to tmp in case user cancels request
                    $scope.prevStartDate = $rootScope.activeDate;
                    $scope.prevEndDate = $rootScope.activeEndDate;

                }
            };

            $scope.today(false);
            $scope.minDate = '2013-06-02';
            $scope.maxDate = new Date();

            $scope.clear = function () {
                $rootScope.dt = null;
            };

            // Disable weekend selection
            $scope.disabled = function(date, mode) {
                return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
            };

            $scope.openCalendarBox = function($event, elementOpened, checkOtherCalendar) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.model[elementOpened] = !$scope.model[elementOpened];
                $scope.stopFlash('calendar');
                if ($scope.model[checkOtherCalendar]) {
                    $scope.model[checkOtherCalendar] = false;
                };
            };

            $rootScope.cancelGT30DaysModal = function() {
                $rootScope.modalDialogs.moreThan30 = false;
            }

            $scope.captureDate = function() {
                $scope.dateFromLocalStorage = false;

                $scope.plotGraph = function() {
                    if ($scope.printerType == 'standard' || $scope.printerType == '') {
                        if ( $scope.modeMonthOrDay == 'Month' ) {
                            if ( $scope.weekNum == 0 ) {
                                $scope.execMonthly();
                            } else {
                                $scope.execDateRange();
                            }
                        } else if ( $scope.modeMonthOrDay == 'Day' ) {
                            $scope.execDateRange();
                        } else if ( $scope.modeMonthOrDay == 'Custom' ) {
                            $scope.execDateRange();
                        }
                    } else if ($scope.printerType == 'rfid') {
                        $scope.prepareRfid($scope.modeMonthOrDay);
                    }
                }

                if ($scope.modeMonthOrDay == 'Custom') {
                    $rootScope.activeDate = $filter('date')($rootScope.dt, 'yyyy-MM-dd');
                    $rootScope.activeEndDate = $filter('date')($rootScope.edt, 'yyyy-MM-dd');
                    $rootScope.minCustomStartDate = moment($rootScope.activeDate).toDate();
                    $rootScope.maxCustomEndDate = moment($rootScope.activeEndDate).toDate();

                    if (specFuncs.hourCount($rootScope.activeEndDate, $rootScope.activeDate, 'days') > 30) {
                        $rootScope.modalDialogs.moreThan30 = true;
                    } else {
                        $scope.plotGraph();
                    }
                } else {
                    $scope.chosenDate = $filter('date')($rootScope.dt, 'yyyy-MM-dd');
                    $rootScope.activeDate = $scope.chosenDate;
                    $scope.endDateExt = $scope.chosenDate;

                    if ( $scope.avatarIdLocalStorage && $scope.queryStringParams ) {
                        $scope.queryStringParams.startdate = $scope.chosenDate;
                        $scope.queryStringParams.enddate = $scope.chosenDate;
                        $scope.queryStringParams.mode = $scope.modeMonthOrDay.toLowerCase();
                        $scope.endDateExt = $scope.chosenDate;
                        window.localStorage.setItem('queryStringParams', JSON.stringify( $scope.queryStringParams ));
                    }

                    $scope.plotGraph();
            }

                $rootScope.continueGT30DaysModal = function() {
                    $rootScope.modalDialogs.moreThan30 = false;
                    $scope.plotGraph();
                    $scope.prevStartDate = $rootScope.activeDate;
                    $scope.prevEndDate = $rootScope.activeEndDate;
                }

                $rootScope.cancelGT30DaysModal = function() {
                    $rootScope.modalDialogs.moreThan30 = false;

                    // Ok, user cancelled, let's restore previous calendar settings
                    $rootScope.dt = moment($scope.prevStartDate).toDate();
                    $rootScope.edt = moment($scope.prevEndDate).toDate();
                    $rootScope.minCustomStartDate = moment($scope.prevStartDate).toDate();
                    $rootScope.maxCustomEndDate = moment($scope.prevEndDate).toDate();
                }
            }

            $scope.devicesSelectedPreviously = false;

            $scope.watchAvatarIdDeviceCollection = function() {
                var unbindWatcher =  $scope.$watch('avatarIdDeviceCollection', function(newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    $scope.isCollapsed = true;
                    $scope.avatarIdCheck = false;
                    $scope.checkedAvatarIds = [];
                    $scope.avatarIdDeviceCollection.filter(function(avatar) {
                        if (avatar.ticked == true) {
                            $scope.checkedAvatarIds.push(avatar.id);
                            $scope.avatarIdCheck = true;
                            $scope.disableCalendar = false;
                            window.localStorage.setItem('avatarIdCollection', JSON.stringify( { 'avatarIds' : $scope.checkedAvatarIds } ));
                        }
                    });

                    if ( $scope.avatarIdCheck ) {
                        $scope.devicesSelectedPreviously = true;
                        if (!$scope.endDateExt) {
                            $scope.endDateExt = $rootScope.activeDate;
                        }
                        if ($scope.printerType == 'standard' || $scope.printerType == '') {
                            if ( $scope.modeMonthOrDay == 'Month' ) {
                                if ( $scope.weekNum == 0 ) {
                                    $scope.loadMonthly($scope.currentGrouping, 'POST');
                                } else {
                                    $scope.loadDateRange($scope.currentGrouping, 'POST');
                                }
                            } else if ( $scope.modeMonthOrDay == 'Day' || $scope.modeMonthOrDay == 'Custom' ) {
                                $scope.loadDateRange($scope.currentGrouping, 'POST');
                            }
                        } else if ($scope.printerType == 'rfid') {
                            $scope.prepareRfid($scope.modeMonthOrDay)
                        }

                    } else {
                        // No avatarId is checked from the dropdown
                        if ( $scope.devicesSelectedPreviously ) {
                            if ($scope.currentGrouping == 'device') {
                                $scope.disableCalendar = true;
                            }
                            $scope.devicesSelectedPreviously = false;
                            if ( !$scope.disableDropdown ) {
                                window.localStorage.removeItem('avatarIdCollection');
                                delete $scope.avatarIdLocalStorage;
                            } else {
                                deleteAvatarIdList();
                            }

                            if ($scope.printerType == 'standard' || $scope.printerType == '') {
                                if ($scope.currentGrouping != 'device') {
                                    if ( $scope.modeMonthOrDay == 'Month' ) {
                                        if ( $scope.weekNum == 0 ) {
                                            $scope.loadMonthly($scope.currentGrouping, 'GET');
                                        } else {
                                            $scope.loadDateRange($scope.currentGrouping, 'GET');
                                        }
                                    } else if ( $scope.modeMonthOrDay == 'Day' || $scope.modeMonthOrDay == 'Custom' ) {
                                        $scope.loadDateRange($scope.currentGrouping, 'GET');
                                    }
                                } else {
                                    $scope.clearGraph();
                                }
                            } else if ($scope.printerType == 'rfid') {
                                if ($scope.currentGrouping != 'device') {
                                    $scope.prepareRfid($scope.modeMonthOrDay)
                                } else {
                                    $scope.clearGraph();
                                }
                            }
                        }
                    }
                }, true);
            }

            $scope.dateOptionsMonth = {
                'year-format': "'yyyy'",
                'starting-day': 0,
                'show-weeks' : false,
                'datepicker-mode' : "'month'",
                'min-mode' : "month",
                'multidate' : true,
                'multi-date' : true
            };

            $scope.dateOptionsDay = {
                'year-format': "'yyyy'",
                'starting-day': 0,
                'show-weeks' : false,
                'datepicker-mode' :"'day'",
                'min-mode' : "day",
                'multidate' : true,
                'multi-date' : true
            };

            $scope.initDate = new Date('2016-15-20');
            $scope.formats = ['yyyy-MM-dd', 'MMM-yyyy', 'MMM dd, yyyy', 'MMMM yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            if ( $scope.modeMonthOrDay == 'Month' ) {
                $scope.formatMonth = $scope.formats[1];
            } else if ( $scope.modeMonthOrDay == 'Day' ) {
                $scope.format = $scope.formats[2];
            }

            $scope.odometerToolbox = [

                { glyphMenu : "fa fa-print",    tool : "deviceOrLocation" },
                { glyphMenu : "ionicons ion-android-earth", tool : "monthOrDay" },
                { glyphMenu : "fa fa-calendar", name : "calendar" },
                { glyphMenu : "fa fa-calendar", name : "sampleRate" }
            ]
        }
    }])

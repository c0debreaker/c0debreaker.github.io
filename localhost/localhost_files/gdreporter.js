cockpitApp.controller('GlobalDashboardController', [
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
        TimezoneFactory
        ) {
        if ( User.isAuthenticated() ) {

            $rootScope.modalDialogs = {
                loadingSpinner  : false
            };

            $scope.gridOptions = {};
            $scope.columnDefs = [];
            $scope.myData = [];
            $scope.gridOptions.data = $scope.myData;
            $scope.gridOptions.columnDefs = $scope.columnDefs;

//            TODO: Keeping this code this it will be useful for restoring table
//
//            $scope.gridOptions.onRegisterApi = function (gridApi) {
//                $scope.gridApi = gridApi;
//            }
//
//            $scope.showColumns = function() {
//                for (i = 0; i < $scope.gridOptions.data.length; i++){
//                    $scope.gridOptions.columnDefs[i].visible = true;
//                }
//                $scope.gridApi.grid.refresh();
//            }

            var specFuncs = new Baam.SpecFuncs();
            $scope.tz = TimezoneFactory;

            $scope.generateReport = function() {

                $rootScope.modalDialogs.loadingSpinner = true;
                $scope.disableDownloadButton = true;
                $scope.hideGrid = true;

                // Let's clear up the grid
                $scope.gridOptions.columnDefs.length = 0;
                $scope.myData.length = 0;

                splitCurrentDate = $rootScope.activeDate.split('-');
                totalDaysGivenMonth = specFuncs.getDaysInMonth(parseInt(splitCurrentDate[1]), parseInt(splitCurrentDate[0]));
                var startDate = specFuncs.convertDateToUTC($rootScope.activeDate + ' 00:00:00');
                var endDate = specFuncs.convertDateToUTC($rootScope.activeDate + ' 00:00:00');

                if ($scope.modeMonthOrDay == 'Custom') {
                    endDate = specFuncs.convertDateToUTC($rootScope.activeEndDate + ' 00:00:00');
                }

                $scope.downloadGDReport = function() {
                    OdometerRestFactory.all('csvexport').get($scope.gdEndpointPath, {
                        reportresourceid : $rootScope.downloadToken,
                        requestType : 'gd' //Not a BAAM API key but is used to identify type of traffic being sent. This is a Global Dashboard request
                    }).then(function(csvdata) {
                        downloadCsvStream(csvdata, $rootScope.csvFilename);
                    })
                }

                OdometerRestFactory.one('gdcsvexport', $scope.gdMode).customPOST(
                    {} , $scope.gdEndpointPath, {
                        startdate : startDate,
                        enddate : endDate
                    }, { 'Accept' : 'application/json;charset=utf-8', 'Content-Type' : 'application/json' })
                    .then(function(data) {
//                        OdometerRestFactory.setDefaultHeaders({ 'Range' : 'bytes=0-4000' });
//                        OdometerRestFactory.all('csvexport').get('months', {
//                            reportresourceid : $scope.reportResourceID
//                        }).then(function(csvdata) {
                        OdometerRestFactory.all('csvexport').get($scope.gdEndpointPath, {
                            reportresourceid : $rootScope.downloadToken,
                            requestType : 'gd' //Not a BAAM API key but is used to identify type of traffic being sent. This is a Global Dashboard request
                        }).then(function(csvdata) {
//                                TODO: Use this code to verify remote filename once it's been implemented in the BAAM API
//                                $http.head($rootScope.csvFilename).success(function(headerResponse){
//                                    console.log("headerResponse line 163", headerResponse);
//                                });

//                              Let's generate the file format based from the header retrieved from the response
                                $scope.gridOptions.columnDefs.length = 0;
                                $scope.myData = csvToJson(csvdata);
                                $scope.gridOptions.data = $scope.myData;

                                for (var i=0; i<csvdata.split("\n")[0].split(",").length; i++) {
                                    $scope.gridOptions.columnDefs.push({ name : JSON.parse(csvdata.split("\n")[0].split(",")[i]), enableSorting: true })
                                }

//                              TODO: Keeping this code since this is required for only downloading small chunk of data from a remote file
//                              $http.get(csvFile, { headers: {'Range': "bytes=0-4000"} }).success(function(data) {
                                $scope.disableDownloadButton = false;
                                $scope.hideGrid = false;
                            }, function(err) {
                                $rootScope.modalDialogs.loadingSpinner = false;
                                $scope.hideGrid = true;
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
                                console.log('Reason for failure:', err);
                            })
                    }, function(err) {
                        $scope.displayError(err);
                    });

            }

            $scope.globalDashboardItems = [
                { mode: 'gateway',  name: 'Gateway', ticked : true },
                { mode: 'device',  name: 'Devices', ticked : false },
                { mode: 'data',  name: 'Data', ticked : false },
                { mode: 'user',  name: 'User', ticked : false }
            ];

            $scope.setGlobalDashboard = function(gdmode) {

                // Let's disable Download button everytime we change the report type
                $scope.disableDownloadButton = true;

                if ($scope.selectedGDMode == gdmode) {
                    return;
                } else {
                    var foundIndex = _.findIndex($scope.globalDashboardItems, function(a) { return a.name == gdmode });
                    $scope.gdMode = $scope.globalDashboardItems[foundIndex].mode;
                    $scope.selectedGDMode = gdmode;
                }
            }

            $scope.dayOrMonth = [
                { path : 'months', icon: '', name: 'Month', ticked: true },
                { path : 'days', icon: '', name: 'Day', ticked: false },
                { path : 'days', icon: '', name: 'Custom', ticked: false }
            ]

            $scope.selectedMonthorDay = function(dayormonth) {
                $scope.dateFromLocalStorage = false;
                if ($scope.modeMonthOrDay == dayormonth) {
                    return;
                } else {
                    var foundIndex = _.findIndex($scope.dayOrMonth, function(a) { return a.name == dayormonth });
                    $scope.gdEndpointPath = $scope.dayOrMonth[foundIndex].path;
                    $scope.modeMonthOrDay = dayormonth;
                    $scope.disableDownloadButton = true;
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
            // For global dashboard
            $scope.selectedGDMode = $scope.globalDashboardItems[0].name;
            $scope.gdMode = 'gateway';
            $scope.gdEndpointPath = 'months';

            $scope.disableCalendar = false;
            $scope.model = {};
            $scope.modeMonthOrDay = 'Month'
            $scope.disableDownloadButton = true;
            $scope.generateReportDivNone = true;
            $scope.generateReportDivBlock = false;
            $scope.hideGrid = true;

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

            $scope.prepareDate = function() {
                $scope.disableDownloadButton = true;
                if ($scope.modeMonthOrDay == 'Custom') {
                    $rootScope.activeDate = $filter('date')($rootScope.dt, 'yyyy-MM-dd');
                    $rootScope.activeEndDate = $filter('date')($rootScope.edt, 'yyyy-MM-dd');
                    $rootScope.minCustomStartDate = moment($rootScope.activeDate).toDate();
                    $rootScope.maxCustomEndDate = moment($rootScope.activeEndDate).toDate();
                } else {
                    $scope.chosenDate = $filter('date')($rootScope.dt, 'yyyy-MM-dd');
                    $rootScope.activeDate = $scope.chosenDate;
                    $scope.endDateExt = $scope.chosenDate;
                }
            }

            $scope.devicesSelectedPreviously = false;

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

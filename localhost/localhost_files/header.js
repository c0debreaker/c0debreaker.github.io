'use strict';

cockpitApp.controller('HeaderCtrl', ['$scope', '$state', 'User', '$rootScope', '$locale', 'tmhDynamicLocale', 'tmhDynamicLocaleCache', '$cookieStore', 'googleChartApiConfig', 'CurrentLocaleFactory', 'OdometerSlidingPanelFactory', '$timeout', function ($scope, $state, User, $rootScope, $locale, tmhDynamicLocale, tmhDynamicLocaleCache, $cookieStore, googleChartApiConfig, CurrentLocaleFactory, OdometerSlidingPanelFactory, $timeout) {

    $scope.user = User.getUserData();

    $rootScope.rotate = false;

    $scope.showCsvLogs = function() {
        if ($rootScope.csvRequestCollection.length > 0) {
            $rootScope.modalDialogs.generatingCsvReport = true;
        } else {
            $rootScope.modalDialogs.noProcess = true;
        }
    }

    $scope.showCsvReportDetails = function(reportDetails) {
        $scope.selectedDownloadToken = reportDetails.downloadToken;
        $scope.selectedCsvPath = reportDetails.csvPath;
        $scope.selectedStartDate = reportDetails.startDate;
        $scope.selectedEndDate = reportDetails.endDate;
        $scope.selectedTimeZone = reportDetails.timeZone;
        $scope.selectedTokenResourceId = reportDetails.tokenResourceId;
        $scope.selectedUserResourceId = reportDetails.userResourceId;
        $rootScope.modalDialogs.showReportDetails = true;
        $scope.fadeItOut = false;

        $timeout(function() {
            $scope.$apply(function() {
                $scope.fadeItOut = true;
            });
        }, 3000);

    }

    var setZatarLogo = function() {
        if (window.innerWidth <= 400) {
            $scope.zatarLogo = 'assets/img/zatarlogo400.png'
        } else
        if (window.innerWidth <= 800) {
            $scope.zatarLogo = 'assets/img/zatarlogo456.png'
        } else
        if (window.innerWidth <= 1200) {
            $scope.zatarLogo = 'assets/img/zatarlogo800.png'
        } else {
            $scope.zatarLogo = 'assets/img/zatarlogo1012.png'
        }
    }
    setZatarLogo();

    var resizeTimeout;
    $(window).resize(function() {
        // Let's automatically adjust the event status bar
        if (resizeTimeout) {
            $timeout.cancel(resizeTimeout);
        }

        resizeTimeout = $timeout(function() {
            $scope.$apply(function() {
                setZatarLogo();
            });
        }, 500);
    });


    $scope.topHeaderDropDownMenus = [
        {ddmenu : 'About Zatar', uisref : "undefined", uiSrefDisplay : "hide"},
        {ddmenu : 'Report a problem', uisref : "undefined", uiSrefDisplay : "hide"},
        {ddmenu : 'ANALYTICS Community', uisref : "undefined", uiSrefDisplay : "hide"},
        {ddmenu : 'Account Settings', uisref : "undefined", uiSrefDisplay : "hide"},
        {ddmenu : 'Logout', uisref : "logout", uiSrefDisplay : "show"}
    ];

    $scope.status = {
        isopen: false
    };

    $scope.toggled = function(open) {
    };

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };

    $scope.availableLocales = [

        {
            col : 1,
            languages: [
                { locale : 'de', language : 'Deutsch'},
                { locale : 'en', language : 'English'},
                { locale : 'no', language : 'Nynorsk'},
                { locale : 'es', language : 'Español'},
                { locale : 'fr', language : 'Français'},
                { locale : 'it', language : 'Italiano'},
                { locale : 'nl', language : 'Nederlands'}
            ]
        },

        {
            col : 2,
            languages: [
                { locale : 'ja', language : 'Japanese'},
                { locale : 'gb', language : 'Britain'},
                { locale : 'br', language : 'Português'},
                { locale : 'ar', language : 'Arabic'},
                { locale : 'tr', language : 'Türkçe'},
                { locale : 'ru', language : 'Русский'},
                { locale : 'zh', language : '简体中文'}
            ]
        }
    ];

    $scope.selectLocale = function(locale) {
        $scope.user = User.getUserData();
        User.storeSelectedLocaleExt(locale);
        $scope.model.selectedItem = locale;
        $scope.currentLocale = CurrentLocaleFactory;
        $scope.currentLocale.locale = locale;
    }

    $scope.$watch('currentLocale.locale', function(newLocaleSetting, previousLocaleSetting) {
        if (newLocaleSetting != previousLocaleSetting) {
            console.log('newLocaleSetting',newLocaleSetting,'previousLocaleSetting',previousLocaleSetting)
            console.log('currentLocale.locale changed ******');
        }
        if (typeof googleChartApiConfig.optionalSettings.language === 'undefined') {
            googleChartApiConfig.optionalSettings = {packages: ['corechart'], language : newLocaleSetting };
        } else {
            googleChartApiConfig.optionalSettings.language = newLocaleSetting;
        }

        tmhDynamicLocale.set(newLocaleSetting).then(function() {
            if (typeof $rootScope.dt === 'undefined') {
            } else {
                if ( typeof $rootScope.dt === 'string' ) {
                    var splitCurrentDate = $rootScope.activeDate.split('-');
                    var tmpDate = new Date(parseInt(splitCurrentDate[0]),parseInt(splitCurrentDate[1])-1, parseInt(splitCurrentDate[2]));
                    $scope.boolChangeClass = false;
                    $rootScope.dt = new Date(tmpDate.getTime());
                    if (newLocaleSetting != previousLocaleSetting) {
                        location.reload();
                    }
                } else {
                    $scope.boolChangeClass = false;
                    $rootScope.dt = new Date($rootScope.dt.getTime());
                    if (newLocaleSetting != previousLocaleSetting) {
                        location.reload();
                    }
                }
            }
        })
    })

    $scope.showLocaleSettingsPane = function() {
        $scope.boolChangeClass = !$scope.boolChangeClass;
        $scope.slidingPanel = OdometerSlidingPanelFactory;
        if ($scope.slidingPanel.toggleOdometerPanel == true) {
            $scope.slidingPanel.toggleOdometerPanel = false;
        }
    }

    $scope.showOdometerControlPanel = function() {
        $scope.slidingPanel = OdometerSlidingPanelFactory;
        $scope.slidingPanel.toggleOdometerPanel = !$scope.slidingPanel.toggleOdometerPanel;

        if ($scope.boolChangeClass == true) {
            $scope.boolChangeClass = false;
        }
    }

    $scope.model={};

    $scope.isOneHighlight = function(item) {
        $scope.currentLocale = CurrentLocaleFactory;

        if ($scope.currentLocale.locale == item) {
            console.log('$scope.currentLocale.locale is equal to item so highlight it ******');
        }
        return $scope.model.selectedItem == item;
    }

    $scope.hideRNFModal = function() {
        $rootScope.modalDialogs.resourceNotFound = false;
    }

    $scope.hideLSModal = function() {
        $rootScope.modalDialogs.loadingSpinner = false;
    }

    $scope.hideCSVModal = function() {
        $rootScope.modalDialogs.generatingCsvReport = false;
    }

    $scope.hideNoProcessModal = function() {
        $rootScope.modalDialogs.noProcess = false;
    }

    $scope.hideIWRodal = function() {
        $rootScope.modalDialogs.invalidWeekRange = false;
    }

    $scope.hideSDModal = function() {
        $rootScope.modalDialogs.selectDevices = false;
    }

    $scope.hideUEModal = function() {
        $rootScope.modalDialogs.unknownError = false;
    }

    $scope.hideTEModal = function() {
        $rootScope.modalDialogs.tokenExpired = false;
        $scope.redirectLoginScreen();
    }

    $scope.redirectLoginScreen = function() {
        User.removeAuthentication();
        $state.go('main', {}, { reload: true });
    }

}]);

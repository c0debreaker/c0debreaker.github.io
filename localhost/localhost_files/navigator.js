cockpitApp.controller('NavigationCtrl', ['$scope', '$state', 'User', function($scope, $state, User) {

//    $scope.user = User.getUserData();
//    if ($scope.user.isAuthenticated === false) {
//        $state.go('login', {}, {reload: true});
//    } else {

        $scope.model={};

        $scope.leftNavMenus = [
//            {
//                mainmenu: "Dashboard",
//                glyphicon : "glyphicon glyphicon-home",
//                glyphiconShow : "hide",  // Values are hide and show. It is used if you want the dropdown to expand
//                submenus: []
//            },
            {
                mainmenu: "Global Dashboard",
                class : "classGlobalDashboard",
                glyphicon : "glyphicon glyphicon-dashboard",
                glyphsize : "1.3em",
                glyphiconShow : "show",
                disabled : false,
                submenus: [
                    { submenu: "Report Generator", id : "subMenuGD",    uiRouterState: "main.gd", linktype: "ui-router", enabled : true }
                ]
            },
            {
                mainmenu: "Printer Analytics",
                class : "classPrinterAnalytics",
                glyphicon : "fa fa-print",
                glyphsize : "1.3em",
                glyphiconShow : "show",
                disabled : false,
                submenus: [
                    { submenu: "Odometers", id : "subMenuOdometers",    uiRouterState: "main.odometer", linktype: "ui-router", enabled : true },
                    { submenu: "Real Time Print Job", id : "subMenuRTPJ", uiRouterState: "main.hourly", linktype: "ui-router", enabled : false },
                    { submenu: "Battery",   id : "subMenuBattery",        uiRouterState: "main.battery", linktype: "ui-router", enabled : false },
                    { submenu: "Printhead Replacement", id : "subMenuPrinthead", uiRouterState: "main.printhead", linktype: "ui-router", enabled : false }
                ]
            },
            {
                mainmenu : "Usage",
                class : "classUsage",
                glyphicon : "fa fa-align-left fa-rotate-270",
                glyphsize : "1.3em",
                glyphiconShow : "show",
                disabled : false,
                submenus : [
                    { submenu: "Users", id : "subMenuUsers", uiRouterState: ".usersmanagement", linktype: "ui-router", enabled : false },
                    { submenu: "Devices", id : "subMenuDevices", uiRouterState: ".devices", linktype: "ui-router", enabled : false }
                ]
            },
//            {
//                mainmenu : "Reporting",
//                class : "classReporting",
//                glyphicon : "glyphicon glyphicon-wrench",
//                glyphiconShow : "show",
//                submenus : [
//                    { submenu: "Reporting", id : "subMenuReporting", uiRouterState: ".usersmanagement", linktype: "ui-router", enabled : false }
//                ]
//            },
            {
                mainmenu : "Settings",
                class : "classSettings",
                glyphicon : "fa fa-cogs",
                glyphsize : "1.3em",
                glyphiconShow : "hide",
                disabled : true,
                submenus : [
//                    { submenu: "Settings", id : "subMenuSettings", uiRouterState: ".usersmanagement", linktype: "ui-router", enabled : false }
                ]
            },
            {
                mainmenu : "Apps",
                class : "classApps",
                glyphicon : "glyphicon glyphicon-earphone",
                glyphsize : "1.3em",
                glyphiconShow : "show",
                disabled : false,
                submenus : [
                    { submenu: "Billing", id : "subMenuBilling", uiRouterState: ".billing", linktype: "ui-router", enabled : false },
                    { submenu: "Zatar", id : "subMenuZatar", uiRouterState: ".zatarapp", linktype: "static", url: "http://api.zatar.com" }
                ]
            }
        ];

        $scope.leftNavMenusUIv2 = [
//            {
//                mainmenu: "Analytics Dashboard",
//                class : "classAnalyticsDashboard",
//                glyphicon : "",
//                glyphsize : "",
//                glyphiconShow : "hide",
//                disabled : false
//            },
            {
                mainmenu: "Printer Analytics",
                class : "classPrinterAnalytics",
                glyphicon : "fa fa-print",
                glyphsize : "1.3em",
                glyphiconShow : "show",
                disabled : false,
                submenus: [
                    { submenu: "Time", id : "subMenuRTPJ", uiRouterState: "main.hourly", linktype: "ui-router", enabled : false },
                    { submenu: "Odometers", id : "subMenuOdometers",    uiRouterState: "main.odometer", linktype: "ui-router", enabled : true },
                    { submenu: "Memory",   id : "subMenuBattery",        uiRouterState: "main.battery", linktype: "ui-router", enabled : false },
                    { submenu: "Real Time Print Job", id : "subMenuPrinthead", uiRouterState: "main.printhead", linktype: "ui-router", enabled : false },
                    { submenu: "Battery", id : "subMenuPrinthead", uiRouterState: "main.printhead", linktype: "ui-router", enabled : false },
                    { submenu: "Printhead", id : "subMenuPrinthead", uiRouterState: "main.printhead", linktype: "ui-router", enabled : false }
                ]
            },
            {
                mainmenu: "Mobile Analytics",
                class : "classMobileAnalytics",
                glyphicon : "glyphicons glyphicons-iphone",
                glyphsize : "1.3em",
                glyphiconShow : "show",
                disabled : false
            },
            {
                mainmenu: "Sensor Data",
                class : "classSensorData",
                glyphicon : "glyphicons glyphicons-iphone",
                glyphsize : "1.3em",
                glyphiconShow : "show",
                disabled : false
            },
            {
                mainmenu: "GI Analytics",
                class : "classGIAnalytics",
                glyphicon : "glyphicons glyphicons-iphone",
                glyphsize : "1.3em",
                glyphiconShow : "show",
                disabled : false
            },
            {
                mainmenu : "Usage",
                class : "classUsage",
                glyphicon : "fa fa-align-left fa-rotate-270",
                glyphsize : "1.3em",
                glyphiconShow : "show",
                disabled : false
            },
            {
                mainmenu : "Reporting",
                class : "classReporting",
                glyphicon : "glyphicon glyphicon-wrench",
                glyphiconShow : "show",
                disabled : true
//                submenus : [
//                    { submenu: "Reporting", id : "subMenuReporting", uiRouterState: ".usersmanagement", linktype: "ui-router", enabled : false }
//                ]
            },
            {
                mainmenu : "Settings",
                class : "classSettings",
                glyphicon : "fa fa-cogs",
                glyphsize : "1.3em",
                glyphiconShow : "hide",
                disabled : true,
                submenus : [
//                    { submenu: "Settings", id : "subMenuSettings", uiRouterState: ".usersmanagement", linktype: "ui-router", enabled : false }
                ]
            },
            {
                mainmenu : "Apps",
                class : "classApps",
                glyphicon : "glyphicon glyphicon-earphone",
                glyphsize : "1.3em",
                glyphiconShow : "show",
                disabled : false,
                submenus : [
                    { submenu: "Billing", id : "subMenuBilling", uiRouterState: ".billing", linktype: "ui-router", enabled : false },
                    { submenu: "Zatar", id : "subMenuZatar", uiRouterState: ".zatarapp", linktype: "static", url: "http://api.zatar.com" }
                ]
            }
        ];

        // Let's preselect the menu of the landing page
        $scope.model.selectedItem = $scope.leftNavMenus[1].submenus[0];
        $scope.isOneHighlight($scope.model.selectedItem);

        $scope.updateOneSpan = function(item) {
            if (item.enabled == true && item != $scope.model.selectedItem) {
                $scope.model.selectedItem = item;
                $state.go(item.uiRouterState);
            }
        }

        $scope.isOneHighlight = function(item) {
            return $scope.model.selectedItem == item;
        }

//        $scope.updateMenu = function(isOpen, $event) {
//            $scope.model.selectedMenu = isOpen;
//        }
//
//        $scope.highlightMenu = function(item) {
//            return $scope.model.selectedMenu == item;
//        }


//    }
}])

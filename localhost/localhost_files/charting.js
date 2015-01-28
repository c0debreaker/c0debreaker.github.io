cockpitApp.controller('ForceUpdateJsonController', ['$scope', '$interval', '$rootScope', 'ChartServicesTotalBytes', 'ChartServicesNumberOfBytes','ChartServicesNumberOfDevices', 'ChartServicesNumberOfMembers', 'ChartServicesAverageLatency', function($scope, $interval, $rootScope, ChartServicesTotalBytes, ChartServicesNumberOfBytes, ChartServicesNumberOfDevices, ChartServicesNumberOfMembers, ChartServicesAverageLatency) {

    $scope.dataLoader1 = ChartServicesTotalBytes.getJsonData();
    $scope.dataLoader1.then(function(data) {
        $scope.jsonData1 = data;
    }, function(response) {
//        console.log('something is wrong', response)
    });

    $scope.dataLoader2 = ChartServicesNumberOfBytes.getJsonData();
    $scope.dataLoader2.then(function(data) {
        $scope.jsonData2 = data;
    }, function(response) {
//        console.log('something is wrong', response)
    });

    $scope.dataLoader3 = ChartServicesNumberOfDevices.getJsonData();
    $scope.dataLoader3.then(function(data) {
        $scope.jsonData3 = data;
    }, function(response) {
//        console.log('something is wrong', response)
    });

    $scope.dataLoader4 = ChartServicesNumberOfMembers.getJsonData();
    $scope.dataLoader4.then(function(data) {
        $scope.jsonData4 = data;
    }, function(response) {
//        console.log('something is wrong', response)
    });

    $scope.dataLoader5 = ChartServicesAverageLatency.getJsonData();
    $scope.dataLoader5.then(function(data) {
        $scope.jsonData5 = data;
    }, function(response) {
//        console.log('something is wrong', response)
    });


    var forceUpdateJson1 = function() {
        for (i=0; i<$scope.jsonData1.length;i++) {
            $scope.jsonData1[i].totalbytesent = Math.random() * (3000000 - 1 + 1) + 1;
            $scope.jsonData1[i].totalbytesreceived = Math.random() * (3000000 - 1 + 1) + 1;
            $scope.jsonData1[i].totalbytes = $scope.jsonData1[i].totalbytesent + $scope.jsonData1[i].totalbytesreceived;
        }
    };

    var randomValue = 0;
    var forceUpdateJson2 = function() {
        for (i=0; i<$scope.jsonData2.length;i++) {
            randomValue1 = Math.abs(Math.random() * (3000000 - 1 + 1) + 1);
            if (randomValue1 < 0) {
//                console.log('Yes, it was a random1 value')
            }
            randomValue2 = Math.abs(Math.random() * (3000000 - 1 + 1) + 1);
            if (randomValue1 < 0) {
//                console.log('Yes, it was a random2 value')
            }
            $scope.jsonData2[i].bsent = randomValue1;
            $scope.jsonData2[i].brcvd = randomValue2;
            $scope.jsonData2[i].total_sent = $scope.jsonData2[i].bsent + $scope.jsonData2[i].brcvd;
        }
    };

    var forceUpdateJson3 = function() {
        for (i=0; i<$scope.jsonData3.length;i++) {
            $scope.jsonData3[i].devicecount = Math.random() * (3000000 - 0) + 0;
        }
    };

    var forceUpdateJson4 = function() {
        for (i=0; i<$scope.jsonData4.length;i++) {
            $scope.jsonData4[i].memberbyuser = Math.random() * (3000000 - 0) + 0;
        }
    };

    var forceUpdateJson5 = function() {
        for (i=0; i<$scope.jsonData5.length;i++) {
            $scope.jsonData5[i].devicelatency = Math.random() * (3000000 - 0) + 0;
        }
    };

//    $rootScope.timer1 = $interval(forceUpdateJson1, 5000);
//    $rootScope.timer2 = $interval(forceUpdateJson2, 7500);
//    $rootScope.timer3 = $interval(forceUpdateJson3, 8000);
//    $rootScope.timer4 = $interval(forceUpdateJson4, 9500);
//    $rootScope.timer5 = $interval(forceUpdateJson5, 11500);

}])

/*
 -----------------------------------------------------
 For Big charts
 -----------------------------------------------------
 */
cockpitApp.controller('generateTotalBytesUsedPerWorldforAreaStackedController', ['$scope', 'RedshiftRestangular', 'ChartServicesTotalBytes', 'User', function($scope, RedshiftRestangular, ChartServicesTotalBytes, User) {
    if (User.isAuthenticated()) {
//        ChartServicesTotalBytes.initJsonData();
//        $scope.dataLoader = ChartServicesTotalBytes.getJsonData();
//        $scope.dataLoader.then(function(data) {
        var user = User.getUserData();
        RedshiftRestangular.all("totalbytesusage").getList({token : user.bearerToken}).then(function(data) {
            $scope.jsonData = data;
            $scope.bigstackedchart = plotStackedColumnChartTemplateForGoogleCharts($scope.jsonData, 'Total Bytes Used Aggregated by World (Received/Sent)', 'user_name', 'totalbytesent', 'totalbytesreceived', 'totalbytes' ); // totalbytes should never be included in stacked column, just added it to make chart beautiful, LOL
            $scope.$watch('jsonData', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                $scope.bigstackedchart = plotStackedColumnChartTemplateForGoogleCharts($scope.jsonData, 'Total Bytes Used Aggregated by World (Received/Sent)', 'user_name', 'totalbytesent', 'totalbytesreceived' , 'totalbytes'); // totalbytes should never be included in stacked column, just added it to make chart beautiful, LOL
            }, true);
        }, function(err) {
            console.log("something is wrong : ", err);
        });
    }
}]);

cockpitApp.controller('generateNumberOfBytesPerWorldforAreaStackedController', ['$scope', 'RedshiftRestangular', 'ChartServicesNumberOfBytes', 'User', function($scope, RedshiftRestangular, ChartServicesNumberOfBytes, User) {
    if (User.isAuthenticated()) {
//        ChartServicesNumberOfBytes.initJsonData();
//        $scope.dataLoader = ChartServicesNumberOfBytes.getJsonData();
//        $scope.dataLoader.then(function(data) {
        var user = User.getUserData();
        RedshiftRestangular.all("numberofbytesperworldpermember").getList({token : user.bearerToken}).then(function(data) {
            $scope.jsonData = data;
            $scope.bigstackedchart = plotStackedColumnChartTemplateForGoogleCharts($scope.jsonData, 'Number of Bytes per World per Member', 'user_name', 'bsent', 'brcvd', 'total_sent' /* , 'bsent', 'brcvd', 'total_sent' */); // total_sent should never be included in stacked column, just added it to make chart beautiful, LOL
            $scope.$watch('jsonData', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                $scope.bigstackedchart = plotStackedColumnChartTemplateForGoogleCharts($scope.jsonData, 'Number of Bytes per World per Member', 'user_name', 'bsent', 'brcvd', 'total_sent'/*, 'bsent', 'brcvd', 'total_sent' */); // total_sent should never be included in stacked column, just added it to make chart beautiful, LOL
            }, true);
        });
    }
}]);

cockpitApp.controller('generateNumberOfDevicesPerWorldforAreaStackedController', ['$scope', 'RedshiftRestangular', 'ChartServicesNumberOfDevices', 'User', function($scope, RedshiftRestangular, ChartServicesNumberOfDevices, User) {
    if (User.isAuthenticated()) {
//        ChartServicesNumberOfDevices.initJsonData();
//        $scope.dataLoader = ChartServicesNumberOfDevices.getJsonData();
//        $scope.dataLoader.then(function(data) {
        var user = User.getUserData();
        RedshiftRestangular.all("numberofdevicesperdworld").getList({token : user.bearerToken}).then(function(data) {
            $scope.jsonData = data;
            $scope.bigstackedchart = plotStackedColumnChartTemplateForGoogleCharts($scope.jsonData, 'Number of Devices per World' , 'user_name', 'devicecount'); // total_sent should never be included in stacked column, just added it to make chart beautiful, LOL
            $scope.$watch('jsonData', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                $scope.bigstackedchart = plotStackedColumnChartTemplateForGoogleCharts($scope.jsonData, 'Number of Devices per World' , 'user_name', 'devicecount'); // total_sent should never be included in stacked column, just added it to make chart beautiful, LOL
            }, true);
        });
    }
}]);

cockpitApp.controller('generateNumberOfMembersPerWorldforAreaStackedController', ['$scope', 'RedshiftRestangular', 'ChartServicesNumberOfMembers', 'User', function($scope, RedshiftRestangular, ChartServicesNumberOfMembers, User) {
    if (User.isAuthenticated()) {
//        ChartServicesNumberOfMembers.initJsonData();
//        $scope.dataLoader = ChartServicesNumberOfMembers.getJsonData();
//        $scope.dataLoader.then(function(data) {
        var user = User.getUserData();
        RedshiftRestangular.all("numberofmembersperworld").getList({token : user.bearerToken}).then(function(data) {
            $scope.jsonData = data;
            $scope.bigstackedchart = plotStackedColumnChartTemplateForGoogleCharts($scope.jsonData, 'Number of Members per World' , 'user_name', 'memberbyuser');
            $scope.$watch('jsonData', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                $scope.bigstackedchart = plotStackedColumnChartTemplateForGoogleCharts($scope.jsonData, 'Number of Members per World' , 'user_name', 'memberbyuser');
            }, true);
        });
    }
}]);

cockpitApp.controller('generateAverageLatencyforAreaStackedController', ['$scope', 'RedshiftRestangular', 'ChartServicesAverageLatency', 'User', function($scope, RedshiftRestangular, ChartServicesAverageLatency, User) {
    if (User.isAuthenticated()) {
//        ChartServicesAverageLatency.initJsonData();
//        $scope.dataLoader = ChartServicesAverageLatency.getJsonData();
//        $scope.dataLoader.then(function(data) {
        var user = User.getUserData();
        RedshiftRestangular.all("averagelatency").getList({token : user.bearerToken}).then(function(data) {
            $scope.jsonData = data;
            $scope.bigstackedchart = plotStackedColumnChartTemplateForGoogleCharts($scope.jsonData, 'Average Latency' , 'user_name', 'devicelatency');
            $scope.$watch('jsonData', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                $scope.bigstackedchart = plotStackedColumnChartTemplateForGoogleCharts($scope.jsonData, 'Average Latency' , 'user_name', 'devicelatency');
            }, true);
        });
    }
}]);

/*
 -----------------------------------------------------
 For Sub Donut charts
 -----------------------------------------------------
 */

cockpitApp.controller('generateTotalBytesUsedPerWorldforHighChartController', ['$scope', 'RedshiftRestangular', 'ChartServicesTotalBytes', 'User', function($scope, RedshiftRestangular, ChartServicesTotalBytes, User) {
    if (User.isAuthenticated()) {
//        ChartServicesTotalBytes.initJsonData();
//        $scope.dataLoader = ChartServicesTotalBytes.getJsonData();
//        $scope.dataLoader.then(function(data) {
        var user = User.getUserData();
        RedshiftRestangular.all("totalbytesusage").getList({token : user.bearerToken}).then(function(data) {
            $scope.jsonData = data;
            $scope.chart = plotDonutChartTemplateForGoogleCharts($scope.jsonData, 130, 120, 'user_name', 'totalbytes');
            $scope.$watch('jsonData', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                $scope.chart = plotDonutChartTemplateForGoogleCharts($scope.jsonData, 130, 120, 'user_name', 'totalbytes');
            }, true);

        });
    }
}])

cockpitApp.controller('generateNumberOfBytesPerWorldforHighChartController', ['$scope', 'RedshiftRestangular', 'ChartServicesNumberOfBytes', 'User', function($scope, RedshiftRestangular, ChartServicesNumberOfBytes, User) {
    if (User.isAuthenticated()) {
//        ChartServicesNumberOfBytes.initJsonData();
//        $scope.dataLoader = ChartServicesNumberOfBytes.getJsonData();
//        $scope.dataLoader.then(function(data) {
        var user = User.getUserData();
        RedshiftRestangular.all("numberofbytesperworldpermember").getList({token : user.bearerToken}).then(function(data) {
            $scope.jsonData = data;
            $scope.chart = plotDonutChartTemplateForGoogleCharts($scope.jsonData, 130, 120, 'user_name', 'total_sent');
            $scope.$watch('jsonData', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                $scope.chart = plotDonutChartTemplateForGoogleCharts($scope.jsonData, 130, 120, 'user_name', 'total_sent');
            }, true);
        });
    }
}])

cockpitApp.controller('generateNumberOfDevicesPerWorldforHighChartController', ['$scope', 'RedshiftRestangular', 'ChartServicesNumberOfDevices', 'User', function($scope, RedshiftRestangular, ChartServicesNumberOfDevices, User) {

    if (User.isAuthenticated()) {
//        ChartServicesNumberOfDevices.initJsonData();
//        $scope.dataLoader = ChartServicesNumberOfDevices.getJsonData();
//        $scope.dataLoader.then(function(data) {
        var user = User.getUserData();
        RedshiftRestangular.all("numberofdevicesperdworld").getList({token : user.bearerToken}).then(function(data) {
            $scope.jsonData = data;
            $scope.chart = plotDonutChartTemplateForGoogleCharts($scope.jsonData, 130, 120, 'user_name', 'devicecount');
            $scope.$watch('jsonData', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                $scope.chart = plotDonutChartTemplateForGoogleCharts($scope.jsonData, 130, 120, 'user_name', 'devicecount');
            }, true);
        });
    }

}])

cockpitApp.controller('generateNumberOfMembersPerWorldforHighChartController', ['$scope', 'RedshiftRestangular', 'ChartServicesNumberOfMembers', 'User', function($scope, RedshiftRestangular, ChartServicesNumberOfMembers, User) {

    if (User.isAuthenticated()) {
//        ChartServicesNumberOfMembers.initJsonData();
//        $scope.dataLoader = ChartServicesNumberOfMembers.getJsonData();
//        $scope.dataLoader.then(function(data) {
        var user = User.getUserData();
        RedshiftRestangular.all("numberofmembersperworld").getList({token : user.bearerToken}).then(function(data) {
            $scope.jsonData = data;
            $scope.chart = plotDonutChartTemplateForGoogleCharts($scope.jsonData, 130, 120, 'user_name', 'memberbyuser');
            $scope.$watch('jsonData', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                $scope.chart = plotDonutChartTemplateForGoogleCharts($scope.jsonData, 130, 120, 'user_name', 'memberbyuser');
            }, true);
        });
    }

}])

cockpitApp.controller('generateAverageLatencyforHighChartController', ['$scope', 'RedshiftRestangular', 'ChartServicesAverageLatency', 'User', function($scope, RedshiftRestangular, ChartServicesAverageLatency, User) {

    if (User.isAuthenticated()) {
//        ChartServicesAverageLatency.initJsonData();
//        $scope.dataLoader = ChartServicesAverageLatency.getJsonData();
//        $scope.dataLoader.then(function(data) {
        var user = User.getUserData();
        RedshiftRestangular.all("averagelatency").getList({token : user.bearerToken}).then(function(data) {
            $scope.jsonData = data;
            $scope.chart = plotDonutChartTemplateForGoogleCharts($scope.jsonData, 130, 120, 'user_name', 'devicelatency');
            $scope.$watch('jsonData', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                $scope.chart = plotDonutChartTemplateForGoogleCharts($scope.jsonData, 130, 120, 'user_name', 'devicelatency');
            }, true);
        });
    }

}])

/*
    Cassandra
 */

cockpitApp.controller('generateMonthlyCassandraChartController', ['$scope', 'ChartServicesNumberOfBytes', 'User', function($scope, ChartServicesNumberOfBytes, User) {

    if (User.isAuthenticated()) {
        $scope.dataLoader = ChartServicesNumberOfBytes.getJsonData();
        $scope.dataLoader.then(function(data) {
            $scope.jsonData = data;
            $scope.chart = plotDonutChartCassandraGoogleCharts($scope.jsonData, 0, 0, 'user_name', 'total_sent');
            $scope.$watch('jsonData', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                $scope.chart = plotDonutChartCassandraGoogleCharts($scope.jsonData,0, 0, 'user_name', 'total_sent');
            }, true);
        });
    }

}])

cockpitApp.controller('generateDailyCassandraChartController', ['$scope', 'DailyCassandraFactory', 'User', function($scope, DailyCassandraFactory, User) {

    if (User.isAuthenticated()) {
        $scope.dataLoader = DailyCassandraFactory.getJsonData();
        $scope.dataLoader.then(function(data) {
            $scope.jsonData = data;
            $scope.dailyudichart = plotDailyCassandraChart($scope.jsonData, 'Daily Usage of UDI', 'user', 'udi', 'report_date', 'bytes_in', 'bytes_out');

       //     $scope.chart = plotDailyAreaChartCassandraGoogleCharts($scope.jsonData, 0, 0, 'user', 'report_date', 'total_bytes');
            $scope.$watch('jsonData', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                $scope.chart = plotDailyCassandraChart($scope.jsonData, 'Daily Usage of UDI', 'user', 'udi', 'report_date', 'bytes_in', 'bytes_out');
            }, true);
        });
    }

}])

cockpitApp.controller('resolveDailyCassandraChartController', ['$scope', 'DeviceUDIFactory', 'CassandraRestangular' , 'User', '$rootScope', function($scope, DeviceUDIFactory, CassandraRestangular, User, $rootScope) {
    if (User.isAuthenticated()) {
        $scope.device = DeviceUDIFactory;
    //    $scope.dataLoader = DeviceUDIFactory.getJsonData();
    //    $scope.dataLoader.then(function(data) {
    //        console.log("resolveDailyCassandraChartController data: ", data)
    //        $scope.udiData = data;
    //        console.log("value inside resolveDailyCassandraChartController :", $scope.udiData)
    //        CassandraRestangular.all("daily").getList({udi : $scope.udiData}).then(function(response) {
    //            console.log("This is the response : ", response);
    //            $scope.jsonData = response;
    //            $scope.dailyudichart = plotDailyCassandraChart($scope.jsonData, 'Daily Usage of UDI', 'user', 'udi', 'report_date', 'bytes_in', 'bytes_out');
    //        })
    //    });

    //    $scope.jsonData = propertyData;
    //    $scope.dailyudichart = plotDailyCassandraChart($scope.jsonData, 'Daily Usage of UDI', 'user', 'udi', 'report_date', 'bytes_in', 'bytes_out');

        $scope.seriesSelected = function (selectedItem) {
            var col = selectedItem.column;

            if (selectedItem.row != null) {
                var row = selectedItem.row;
                console.log("col, row :", col, row);
                console.log($scope.dailyudichart.data.rows[row].c[col].f);
            }
        };
            //If there's no row value, user clicked the legend.
    //        if (selectedItem.row == null) {
    //            //If true, the chart series is currently displayed normally.  Hide it.
    //            if ($scope.dailyudichart.view.columns[col] == col) {
    //                //Replace the integer value with this object initializer.
    //                $scope.dailyudichart.view.columns[col] = {
    //                    //Take the label value and type from the existing column.
    //                    label: $scope.dailyudichart.data.getColumnLabel(col),
    //                    type: $scope.dailyudichart.data.getColumnType(col),
    //                    //makes the new column a calculated column based on a function that returns null,
    //                    //effectively hiding the series.
    //                    calc: function () {
    //                        return null;
    //                    }
    //                };
    //                //Change the series color to grey to indicate that it is hidden.
    //                //Uses color[col-1] instead of colors[col] because the domain column (in my case the date values)
    //                //does not need a color value.
    //                $scope.dailyudichart.options.colors[col-1] = '#CCCCCC';
    //            }
    //            //series is currently hidden, bring it back.
    //            else{
    //                //Simply reassigning the integer column index value removes the calculated column.
    //                $scope.dailyudichart.view.columns[col]=col;
    //                //I had the original colors already backed up in another array.  If you want to do this in a more
    //                //dynamic way (say if the user could change colors for example), then you'd need to have them backed
    //                //up when you switch to grey.
    //                $scope.dailyudichart.options.colors[col-1] = $scope.dailyudichart.options.defaultColors[col-1];
    //            }
    //        }
    }
}])

// For the table
cockpitApp.controller('MonthlyCassandraController', ['$scope', '$state', 'ngTableParams', 'CassandraRestangular', 'ModalHandler', 'MonthlyCassandraFactory', 'DeviceUDIFactory', '$filter', 'User', function($scope, $state, ngTableParams, CassandraRestangular, ModalHandler, MonthlyCassandraFactory, DeviceUDIFactory, $filter, User) {
       if (User.isAuthenticated()) {

       var user = User.getUserData();
       CassandraRestangular.all("monthly").getList({token : user.bearerToken}).then(function(data) {
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 2,           // count per page
                sorting: {
                    name: 'asc'     // initial sorting
                }
            }, {
                groupBy: 'user',
                total: data.length, // length of data
                getData: function($defer, params) {
                    var orderedData = params.sorting() ?
                        $filter('orderBy')(data, $scope.tableParams.orderBy()) :
                        data;

                    $scope.monthlyCassandraData = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    var user = User.getUserData();
                    CassandraRestangular.all("daily").getList({token : user.bearerToken, udi : $scope.monthlyCassandraData[0].udi})
                        .then(function(response) {
                            $scope.jsonData = response;
                            $scope.dailyudichart = plotDailyCassandraChart($scope.jsonData, 'Daily Usage of UDI', 'user', 'udi', 'report_date', 'bytes_in', 'bytes_out');
                            $scope.dailyudichart2 = plotDailyCassandraChart($scope.jsonData, 'Daily Usage of UDI', 'user', 'udi', 'report_date', 'bytes_in', 'bytes_out');
                            $scope.dailyudichart3 = plotDailyCassandraChart($scope.jsonData, 'Daily Usage of UDI', 'user', 'udi', 'report_date', 'bytes_in', 'bytes_out');
                            $scope.dailyudichart4 = plotDailyCassandraChart($scope.jsonData, 'Daily Usage of UDI', 'user', 'udi', 'report_date', 'bytes_in', 'bytes_out');
                        }, function(err) {
                            if (err.status == 401) {
                                ModalHandler.open('AuthModalInstanceCtrl', 'servererror.html');
                               // $state.go('login', {}, {reload: true});
                            } else {
                                ModalHandler.open('ServerModalInstanceCtrl', 'servererror.html');
                            }
                        })
                    $defer.resolve($scope.monthlyCassandraData);
                }
            });

            $scope.$watch('monthlyCassandraData', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
            }, true);
        },function(err) {
           if (err.status == 401) {
               ModalHandler.open('AuthModalInstanceCtrl', 'servererror.html');
               // $state.go('login', {}, {reload: true});
           } else {
               ModalHandler.open('ServerModalInstanceCtrl', 'servererror.html');
           }
        });

        $scope.seriesSelected = function (selectedItem) {
            var col = selectedItem.column;

            if (selectedItem.row != null) {
                var row = selectedItem.row;
                console.log("col, row :", col, row);
                console.log($scope.dailyudichart.data.rows[row].c[col].f);
            }
            //If there's no row value, user clicked the legend.
    //        if (selectedItem.row == null) {
    //            //If true, the chart series is currently displayed normally.  Hide it.
    //            if ($scope.dailyudichart.view.columns[col] == col) {
    //                //Replace the integer value with this object initializer.
    //                $scope.dailyudichart.view.columns[col] = {
    //                    //Take the label value and type from the existing column.
    //                    label: $scope.dailyudichart.data.getColumnLabel(col),
    //                    type: $scope.dailyudichart.data.getColumnType(col),
    //                    //makes the new column a calculated column based on a function that returns null,
    //                    //effectively hiding the series.
    //                    calc: function () {
    //                        return null;
    //                    }
    //                };
    //                //Change the series color to grey to indicate that it is hidden.
    //                //Uses color[col-1] instead of colors[col] because the domain column (in my case the date values)
    //                //does not need a color value.
    //                $scope.dailyudichart.options.colors[col-1] = '#CCCCCC';
    //            }
    //            //series is currently hidden, bring it back.
    //            else{
    //                //Simply reassigning the integer column index value removes the calculated column.
    //                $scope.dailyudichart.view.columns[col]=col;
    //                //I had the original colors already backed up in another array.  If you want to do this in a more
    //                //dynamic way (say if the user could change colors for example), then you'd need to have them backed
    //                //up when you switch to grey.
    //                $scope.dailyudichart.options.colors[col-1] = $scope.dailyudichart.options.defaultColors[col-1];
    //            }
    //        }
        };

        $scope.displayDeviceUDI = function(param) {
            $scope.device = DeviceUDIFactory;
            $scope.device.udi = param;
        }

        $scope.$watch('device.udi', function (newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }
            var user = User.getUserData();
            CassandraRestangular.all("daily").getList({token : user.bearerToken, udi : $scope.device.udi})
                .then(function(response) {
                    $scope.jsonData = response;
                    $scope.dailyudichart = plotDailyCassandraChart($scope.jsonData, 'Daily Usage of UDI', 'user', 'udi', 'report_date', 'bytes_in', 'bytes_out');
                    $scope.dailyudichart2 = plotDailyCassandraChart($scope.jsonData, 'Daily Usage of UDI', 'user', 'udi', 'report_date', 'bytes_in', 'bytes_out');
                    $scope.dailyudichart3 = plotDailyCassandraChart($scope.jsonData, 'Daily Usage of UDI', 'user', 'udi', 'report_date', 'bytes_in', 'bytes_out');
                    $scope.dailyudichart4 = plotDailyCassandraChart($scope.jsonData, 'Daily Usage of UDI', 'user', 'udi', 'report_date', 'bytes_in', 'bytes_out');
                }, function(err) {
                    if (err.status == 401) {
                        ModalHandler.open('AuthModalInstanceCtrl', 'servererror.html');
                       // $state.go('login', {}, {reload: true});
                    } else {
                        ModalHandler.open('ServerModalInstanceCtrl', 'servererror.html');
                    }
                })
        }, true);
   }
}])


cockpitApp.controller('DailyCassandraController', ['$scope', 'ngTableParams', 'DailyCassandraFactory', '$filter', 'User', function($scope, ngTableParams, DailyCassandraFactory, $filter, User) {
    if (User.isAuthenticated()) {
//        console.log('DailyCassandraController .....');
//        $scope.dataLoader = DailyCassandraFactory.getJsonData();
//        $scope.dataLoader.then(function(data) {

        var user = User.getUserData();
        CassandraRestangular.all("daily").getList({token : user.bearerToken}).then(function(data) {

            // $scope.monthlyCassandraData = data;
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10,           // count per page
                sorting: {
                    name: 'asc'     // initial sorting
                }
            }, {
                groupBy: 'user',
                total: data.length, // length of data
                getData: function($defer, params) {
                    var orderedData = params.sorting() ?
                        $filter('orderBy')(data, $scope.tableParams.orderBy()) :
                        data;
                    $scope.monthlyCassandraData = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    $defer.resolve($scope.monthlyCassandraData);
                }
            });

            $scope.$watch('monthlyCassandraData', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
            }, true);
        });
    }
}])
/*
 -----------------------------------------------------
 For Hourly, duration charts
 -----------------------------------------------------
 */
cockpitApp.controller('generateTotalBytesUsedHourlyController', ['$scope', 'ChartServicesTotalBytes', 'User', function($scope, ChartServicesTotalBytes, User) {
    if (User.isAuthenticated()) {
        $scope.dataLoader = ChartServicesTotalBytes.getJsonData();
        $scope.dataLoader.then(function(data) {
            $scope.jsonData = data;
            $scope.hourlychart = plotStackedColumnChartTemplateForGoogleCharts($scope.jsonData, 'Total Bytes Used Aggregated by World (Received/Sent)', 'user_name', 'totalbytesent', 'totalbytesreceived', 'totalbytes' ); // totalbytes should never be included in stacked column, just added it to make chart beautiful, LOL
            $scope.$watch('jsonData', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                $scope.hourlychart = plotStackedColumnChartTemplateForGoogleCharts($scope.jsonData, 'Total Bytes Used Aggregated by World (Received/Sent)', 'user_name', 'totalbytesent', 'totalbytesreceived' , 'totalbytes'); // totalbytes should never be included in stacked column, just added it to make chart beautiful, LOL
            }, true);
        });
    }
}]);

cockpitApp.controller('MonthDurationCtrl', ['$scope', '$rootScope', '$http', '$filter', 'User', function($scope, $rootScope, $http, $filter, User) {
    if (User.isAuthenticated()) {

        // Initialize

        $scope.selectedUser = 0;
        $scope.hourNum = 0;

        $scope.retrieveUsers = function() {
            $scope.usernames = [];
            $http.get('http://localhost:3000/app/v1/getusers')
                .then(function(res) {
                    $scope.usernames = res.data;
                    $scope.usernames.unshift({companyname: "All", userid: 0})
                    $scope.user = $scope.usernames[0];
                });
        };
        $scope.retrieveUsers();

        $scope.plotMonthly = function() {
            $scope.monthlychart = plotMonthlyChartForGoogleCharts($scope.monthlyUsageByDuration, 'Monthly Total Accumulated Usage of Devices', 'companyname', 'datestampmod', 'storage_usage');
        }

        $scope.loadMonthly = function() {
            $scope.monthlyUsageByDuration = [];
            $http.get('http://localhost:33306/app/v1/monthly?dateinput='+$scope.chosenDate+'&userid='+$scope.selectedUser)
                .then(function(res) {
                    $scope.monthlyUsageByDuration = res.data;
                    $scope.plotMonthly();
                });
        };

        $scope.displayUserSelected = function() {
            $scope.selectedUser = $scope.user.userid;
            $scope.loadMonthly();
        }

        // --------------------------------------------------------
        //  For DateTimePicker
        $scope.today = function() {
            if (typeof($rootScope.dtMonthly) == 'undefined') {
                $scope.dt = new Date();
            } else {
                $scope.dt = $rootScope.dtMonthly;
            }
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };

        $scope.$watch('dt', function () {
                $scope.chosenDate = $filter('date')($scope.dt, 'yyyy-MM-dd');
                $scope.loadMonthly();
                $rootScope.dtMonthly = $scope.chosenDate;
                return $scope.dt;
            },
            function (newValue, oldValue) {
            }, true);

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.initDate = new Date('2016-15-20');
        $scope.formats = ['MMMM yyyy', 'yyyy-MM-dd', 'MMMM dd, yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
    }
}])

cockpitApp.controller('HourDurationCtrl', ['$scope', '$rootScope', '$http', '$filter', 'SocketDispatcher', 'User', function($scope, $rootScope, $http, $filter, SocketDispatcher, User) {
    if (User.isAuthenticated()) {

        // Pre-select user 0 so loadHourly() doesn't fail
        // Initialize

        $scope.selectedUser = 0;
        $scope.samplingRate = 5;
        $scope.hourNum = 0;

    //    $scope.dataSocketLoader = SocketDispatcher.getJsonData();
    //    $scope.dataSocketLoader.then(function(data) {
    //        $scope.jsonData = data;
    //        console.log('retrieved data via sockets ....');
    //        console.log(data);
    ////        $scope.bigstackedchart = plotStackedColumnChartTemplateForGoogleCharts($scope.jsonData, 'Total Bytes Used Aggregated by World (Received/Sent)', 'user_name', 'totalbytesent', 'totalbytesreceived', 'totalbytes' ); // totalbytes should never be included in stacked column, just added it to make chart beautiful, LOL
    //        $scope.$watch('jsonData', function(newValue, oldValue) {
    //            if (newValue === oldValue) {
    //                return;
    //            }
    //            console.log('new data from sockets ....');
    //            console.log($scope.jsonData);
    ////            $scope.bigstackedchart = plotStackedColumnChartTemplateForGoogleCharts($scope.jsonData, 'Total Bytes Used Aggregated by World (Received/Sent)', 'user_name', 'totalbytesent', 'totalbytesreceived' , 'totalbytes'); // totalbytes should never be included in stacked column, just added it to make chart beautiful, LOL
    //        }, true);
    //    });

    //    $rootScope.primus.on('hourlydata', function received(data) {

        $rootScope.primus.on('event-name', function(data) {
            console.log('event-name : ', data);
            $rootScope.primus.emit('custom-event', { baam: 'baam-value' }, 1, 'baam');
        });

        $rootScope.primus.on('serverdata', function(arg) {
            console.log('serverdata: ', arg);
        });

        $rootScope.primus.on('hdata', function(data) {
    //        console.log('hdata');
    //        console.log(data);
            $scope.jsonData = data;
            $scope.$apply();
        });

        $scope.$watch('jsonData', function (newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }
            $scope.hourlychart = plotHourlyChartForGoogleCharts($scope.jsonData, 'Hourly Total Usage of Devices', 'companyname', 'devicename', 'starttime', 'endtime', 'totalBytesIn', 'totalBytesOut');
    //        return $scope.jsonData;
        }, true);


        $scope.retrieveUsers = function() {
            $scope.usernames = [];
            $http.get('http://localhost:3000/app/v1/getusers')
                .then(function(res) {
                    $scope.usernames = res.data;
                    $scope.usernames.unshift({companyname: "All", userid: 0})
                    $scope.user = $scope.usernames[0];
                });
        };
        $scope.retrieveUsers();

        $scope.plotHourly = function() {
            $scope.hourlychart = plotHourlyChartForGoogleCharts($scope.hourlyUsageByDuration, 'Hourly Total Usage of Devices', 'companyname', 'devicename', 'starttime', 'endtime', 'totalBytesIn', 'totalBytesOut');
    //        console.log($rootScope.jsonData);
    //        console.log($scope.hourlychart);
        }

        $scope.loadHourly = function() {
            $scope.hourlyUsageByDuration = [];
            // This is a mysql REST endpoint call
            $http.get('http://localhost:33306/app/v1/hourly?rate='+$scope.samplingRate+'&date='+$scope.chosenDate+'&hour='+$scope.hourNum+'&userid='+$scope.selectedUser)
                .then(function(res) {
                    $scope.hourlyUsageByDuration = res.data;
                    $scope.plotHourly();
                });
        };

        $scope.hourDurations =
            [
                { hourNum: 0,  hourRange: "00:00 - 01:00" },
                { hourNum: 1,  hourRange: "01:00 - 02:00" },
                { hourNum: 2,  hourRange: "02:00 - 03:00" },
                { hourNum: 3,  hourRange: "03:00 - 04:00" },
                { hourNum: 4,  hourRange: "04:00 - 05:00" },
                { hourNum: 5,  hourRange: "05:00 - 06:00" },
                { hourNum: 6,  hourRange: "06:00 - 07:00" },
                { hourNum: 7,  hourRange: "07:00 - 08:00" },
                { hourNum: 8,  hourRange: "08:00 - 09:00" },
                { hourNum: 9,  hourRange: "09:00 - 10:00" },
                { hourNum: 10, hourRange: "10:00 - 11:00" },
                { hourNum: 11, hourRange: "11:00 - 12:00" },
                { hourNum: 12, hourRange: "12:00 - 13:00" },
                { hourNum: 13, hourRange: "13:00 - 14:00" },
                { hourNum: 14, hourRange: "14:00 - 15:00" },
                { hourNum: 15, hourRange: "15:00 - 16:00" },
                { hourNum: 16, hourRange: "16:00 - 17:00" },
                { hourNum: 17, hourRange: "17:00 - 18:00" },
                { hourNum: 18, hourRange: "18:00 - 19:00" },
                { hourNum: 19, hourRange: "19:00 - 20:00" },
                { hourNum: 20, hourRange: "20:00 - 21:00" },
                { hourNum: 21, hourRange: "21:00 - 22:00" },
                { hourNum: 22, hourRange: "22:00 - 23:00" },
                { hourNum: 23, hourRange: "23:00 - 24:00" }
            ];

        $scope.intervalRates = [
            { samplingRate: 5,  rateText: "5 mins" },
            { samplingRate: 10, rateText: "10 mins" },
            { samplingRate: 15, rateText: "15 mins" },
            { samplingRate: 30, rateText: "30 mins" }
        ];

        $scope.displayDurationSelected = function() {
            $scope.selectedIndex = $scope.dropdown.hourRange;
            $scope.hourRange = $scope.dropdown.hourRange;
            $scope.hourNum = $scope.dropdown.hourNum;
            $scope.loadHourly();
        }
        $scope.displayIntervalSelected = function() {
            $scope.samplingRate = $scope.rates.samplingRate;
            $scope.loadHourly();
        }
        $scope.displayIntervalSelectedRadio = function() {
            $scope.samplingRate = $scope.currentInterval;
            $scope.loadHourly();
        }

        $scope.displayUserSelected = function() {
            $scope.selectedUser = $scope.user.userid;
            $scope.loadHourly();
        }
        // These codes are just used to display default value in dropdown
        $scope.dropdown = $scope.hourDurations[0];
        $scope.rates = $scope.intervalRates[0];
        $scope.currentInterval = 5;

        // --------------------------------------------------------
        //  For DateTimePicker
        $scope.today = function() {
            if (typeof($rootScope.activeDate) == 'undefined') {
                $scope.dt = new Date();
            } else {
            $scope.dt = $rootScope.activeDate;
            }
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };

        $scope.$watch('dt', function () {
                $scope.chosenDate = $filter('date')($scope.dt, 'yyyy-MM-dd');
                $scope.loadHourly();
                $rootScope.activeDate = $scope.chosenDate;
                return $scope.dt;
            },
            function (newValue, oldValue) {
            }, true);

    //    $rootScope.$watch('jsonData', function () {
    //            console.log('capturing jsonData via sockets .....');
    //            console.log($rootScope.jsonData);
    //            return $scope.dt;
    //        }, true);

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.initDate = new Date('2016-15-20');
        $scope.formats = ['yyyy-MM-dd', 'MMMM dd, yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[1    ];

    }
}])

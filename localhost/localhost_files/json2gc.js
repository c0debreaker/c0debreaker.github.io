cockpitApp.factory('Json2GCFactory', ['PrinterModels', 'AvatarIdMapFactory', 'RFIDPropertyMap', 'NonRFIDPropertyMap',
    function(PrinterModels, AvatarIdMapFactory, RFIDPropertyMap, NonRFIDPropertyMap) {

    var chartColors = window.GoogleCharts.chartProperties.colors;
    var specFuncs = new Baam.SpecFuncs();

    function retrieveProperModelName(modelName) {

        try {
            var modelPropertyKey = _.property(modelName.toUpperCase());
            return modelPropertyKey(_.find(PrinterModels, modelPropertyKey));
        }

        catch(err) {
            return '-' + modelName + '-'
        }
    }

    function retrieveMappedName(avatarId, udi) {

        var idLoader = AvatarIdMapFactory;
        var avatarIdMapping = idLoader.idListing;

        if ( avatarIdMapping[avatarId.toString()] && avatarIdMapping[avatarId.toString()][0].name.length > 0) {
            return avatarIdMapping[avatarId.toString()][0].name;
        } else
        if ( avatarIdMapping[avatarId.toString()] && avatarIdMapping[avatarId.toString()][0].name.length == 0) {
            return retrieveProperModelName(avatarIdMapping[avatarId.toString()][0].sysPrefix) + ' (' + avatarIdMapping[avatarId.toString()][0].serialNumber + ')'
        } else
        if ( !avatarIdMapping[avatarId.toString()] ) {
            return udi;
        }
    }

    return {
         retrieveProperModelName : function(modelName) {

            try {
                var modelPropertyKey = _.property(modelName.toUpperCase());
                return modelPropertyKey(_.find(PrinterModels, modelPropertyKey));
            }

            catch(err) {
                return '-' + modelName + '-'
            }
        },

        generateHourlyGraphObject : function(grapherFunction, data, modelLocation, sortKey, mode, startDate, endDate, totalDaysInMonth) {

            var graphDataforGoogleChartsArray = [], tmpScopeDeviceModel = [];

            var outputForHourly = _.chain(data[0].dates)
                .pluck(modelLocation)
                .flatten()
                .pluck("devices")
                .flatten()
                .groupBy(function(value) {
                    if (sortKey == 'location' ) {
                        return value[sortKey].toUpperCase();
                    } else {
                        return value[sortKey];
                    }
                })

                .map(function (devices) {
                    return { c : _(devices)
                        .map(function(dev) {
                            return {
                                id : sortKey == 'location' ? dev[sortKey].toUpperCase() : dev[sortKey],
                                v : dev.odometerInchesPrinted,
                                f : retrieveMappedName(dev.avatarResourceId, dev.udi) + ' - ' + dev.odometerInchesPrinted + (dev.odometerInchesPrinted > 0 ? " inches" : " inch")
                            }
                        })
                        .value()
                    }
                })

                .value();

            var cols = [];

            outputForHourly.forEach(function(f) {

                for (var i = 0; i <= f.c.length; i++) {
                    if (i == 0) {
                        cols.push({
                                id: 'header-id',
                                label: '',
                                type: 'string',
                                deviceId : f.c[0].id
                            }
                        );
                    } else {
                        cols.push({
                                id: "item-id",
                                label: '',
                                type: "number"
                            }
                        );
                    }
                }
                graphDataforGoogleChartsArray.push( { "cols" : cols, "rows": [ f ] } );
                cols = [];
            })

            var deviceCountPerLocation = _(data[0].dates)
                .pluck(modelLocation)
                .flatten()
                .pluck('devices')
                .flatten()
                .groupBy(function(value) {
                    if (sortKey == 'location' ) {
                        return value[sortKey].toUpperCase();
                    } else {
                        return value[sortKey];
                    }
                })
                .mapValues(function (devicesForLocation) {
                    return _(devicesForLocation)
                        .pluck('udi')
                        .uniq()
                        .value()
                        .length;
                })
                .value()

            graphDataforGoogleChartsArraySorted = _.chain(graphDataforGoogleChartsArray)
                .sortBy(function (d) {
                    return d.cols[0].deviceId.toLowerCase()
                })
                .value()

            for ( i = 0; i < graphDataforGoogleChartsArraySorted.length; i++ ) {
                color = i % 5;
                var totalPrinted = 0, avgInches = 0;
                totalPrinted = _.flatten(graphDataforGoogleChartsArraySorted[i].rows[0].c).reduce(function(sum, num) { return sum = sum + num.v }, 0)
                avgInches = totalPrinted;
                deviceConnected = deviceCountPerLocation[graphDataforGoogleChartsArraySorted[i].rows[0].c[0].id];
                graphDataforGoogleChartsArraySorted[i].rows[0].c.unshift({}); // Google Charts requires an empty object at the beginning of data

                tmpScopeDeviceModel.push( {
                    modelOrLocation : graphDataforGoogleChartsArraySorted[i].cols[0].deviceId,
                    chart : grapherFunction(graphDataforGoogleChartsArraySorted[i], chartColors[color], startDate, deviceConnected, '', false, 'ColumnChart', 'none'),
                    leftCellNumber : totalPrinted,
                    middleCellNumber : totalPrinted,
                    rightCellNumber : deviceConnected,
                    leftCellText : "Avg. Inches/hr",
                    middleCellText :  "Total Inches Printed",
                    rightCellText : deviceConnected > 1 ? "Devices Connected" : "Device Connected",
                    dotColor : chartColors[color]
                } );
            }

            return tmpScopeDeviceModel;
        },

        generateMonthlyGraphObject : function(grapherFunction, data, modelLocation, sortKey, mode, startDate, endDate, totalDaysInMonth) {
            var graphDataforGoogleChartsArray = [], tmpScopeDeviceModel = [];
            var outputForHourly = _.chain(data[0].dates)
                .pluck(modelLocation)
                .flatten()
                .pluck("devices")
                .flatten()
                .groupBy(function(value) {
                    if (sortKey == 'location' ) {
                        return value[sortKey].toUpperCase();
                    } else {
                        return value[sortKey];
                    }
                })
                .map(function (devices) {
                    return { c : _(devices)
                        .map(function(dev) {
                            return {
                                id : sortKey == 'location' ? dev[sortKey].toUpperCase() : dev[sortKey],
                                v : dev.odometerInchesPrinted,
                                f : retrieveMappedName(dev.avatarResourceId, dev.udi) + ' - ' + dev.odometerInchesPrinted + (dev.odometerInchesPrinted > 0 ? " inches" : " inch")
                            }
                        })
                        .value()
                    }
                })

                .value();

            var cols = [];

            outputForHourly.forEach(function(f) {

                for (var i = 0; i <= f.c.length; i++) {
                    if (i == 0) {
                        cols.push({
                                id: 'header-id',
                                label: '',
                                type: 'string',
                                deviceId : f.c[0].id
                            }
                        );
                    } else {
                        cols.push({
                                id: "item-id",
                                label: '',
                                type: "number"
                            }
                        );
                    }
                }
                graphDataforGoogleChartsArray.push( { "cols" : cols, "rows": [ f ] } );
                cols = [];
            })

            var deviceCountPerLocation = _(data[0].dates)
                .pluck(modelLocation)
                .flatten()
                .pluck('devices')
                .flatten()
                .groupBy(function(value) {
                    if (sortKey == 'location' ) {
                        return value[sortKey].toUpperCase();
                    } else {
                        return value[sortKey];
                    }
                })
                .mapValues(function (devicesForLocation) {
                    return _(devicesForLocation)
                        .pluck('udi')
                        .uniq()
                        .value()
                        .length;
                })
                .value()

            var weekDivisor = specFuncs.getWeeksInMonth(startDate.split('-')[0], startDate.split('-')[1]);

            graphDataforGoogleChartsArraySorted = _.chain(graphDataforGoogleChartsArray)
                .sortBy(function (d) {
                    return d.cols[0].deviceId.toLowerCase()
                })
                .value()

            for ( i = 0; i < graphDataforGoogleChartsArraySorted.length; i++ ) {
                color = i % 5;
                var totalPrinted = 0, avgInches = 0;
                totalPrinted = _.flatten(graphDataforGoogleChartsArraySorted[i].rows[0].c).reduce(function(sum, num) { return sum = sum + num.v }, 0);
                avgInches = Math.round(totalPrinted / weekDivisor);
                deviceConnected = deviceCountPerLocation[graphDataforGoogleChartsArraySorted[i].rows[0].c[0].id];
                graphDataforGoogleChartsArraySorted[i].rows[0].c.unshift({}); // Google Charts requires an empty object at the beginning of data
                tmpScopeDeviceModel.push( {
                    modelOrLocation : graphDataforGoogleChartsArraySorted[i].cols[0].deviceId,
                    chart : grapherFunction(graphDataforGoogleChartsArraySorted[i], chartColors[color], startDate, '', 'datetime', 'odometerInchesPrinted'),
                    leftCellNumber : avgInches,
                    middleCellNumber : totalPrinted,
                    rightCellNumber : deviceConnected,
                    leftCellText : "Avg. Inches/wk",
                    middleCellText :  "Total Inches Printed",
                    rightCellText : deviceConnected > 1 ? "Devices Connected" : "Device Connected",
                    dotColor : chartColors[color]
                } );
            }

            return tmpScopeDeviceModel;

        },

        // TODO: Will delete this function on the next commit. I want to make sure it's not being used anywhere
//        generateCustomDailyGraph : function(grapherFunction, data, startDate, totalDays, tickMode, legendPosition) {
//
//            var graphDataforGoogleChartsArray = [], tmpScopeDeviceModel = [], chartType;
//            var outputPostDateRange = _.chain(data[0].dates)
//                .map(function(d) {
//                    return _.map(d.devices, function(eachDevice) {
//                        return {
//                            deviceModel : eachDevice.deviceModel,
//                            location: eachDevice.location,
//                            odometerInchesPrinted: eachDevice.odometerInchesPrinted,
//                            avatarResourceId: eachDevice.avatarResourceId,
//                            udi: eachDevice.udi,
//                            datetime: d.datetime
//                        }
//                    })
//                })
//                .flatten()
//                .groupBy('udi')
//                .map(function(n) {
//                    return _.map(n, function(device) {
//                        var tmp = [];
//                        var year = parseInt(device.datetime.split('-')[0]);
//                        var month = parseInt(device.datetime.split('-')[1])-1;
//                        var day = parseInt(device.datetime.split('-')[2]);
//                        tmp.push( { "v": device.datetime.indexOf('Z') == -1 ? new Date(year, month, day, 0, 0, 0) : new Date(device.datetime), id : retrieveMappedName(device.avatarResourceId, device.udi), location : device.location } );
//                        tmp.push( { "v" : parseInt(device.odometerInchesPrinted), "f" : device.odometerInchesPrinted + (device.odometerInchesPrinted > 0 ? " inches" : " inch") } )
//                        return { c : tmp };
//                    })
//                })
//                .value()
//
//            function to_date(o) {
//                o.c[0].v = new Date(o.c[0].v);
//                return o;
//            }
//            function asc_start_time(o) {
//                return o.c[0].v.getTime();
//            }
//
//            outputPostDateRange.forEach(function(gChartData) {
//
//                var sortedGoogleChart = _.chain(gChartData)
//                    // TODO Jan 8: commenting out temporarily because we are doing a moment on date above
//                    // Will delete when Gayana says everything is working great. So far, there shouldn't be any issues
//                    // .map(to_date)
//                    .sortBy(asc_start_time)
//                    .value();
//
//                graphDataforGoogleChartsArray.push({
//                    "cols": [
//                        {
//                            "id": "datetime-id",
//                            "label": "datetime",
//                            "type": "datetime"
//                        },
//                        {
//                            "id": "odometerInchesPrinted-id",
//                            "label": "odometerInchesPrinted",
//                            "type": "number"
//                        }
//                    ],
//                    "rows" : sortedGoogleChart
//
//                })
//            })
//
//            graphDataforGoogleChartsArraySorted = _.chain(graphDataforGoogleChartsArray)
//                .sortBy(function (d) {
//                    return d.rows[0].c[0].id.toLowerCase()
//                })
//                .value()
//
//            for ( i = 0; i < graphDataforGoogleChartsArraySorted.length; i++ ) {
//                color = i % 5;
//                var totalPrinted = 0, avgInches = 0;
//                totalPrinted = _.chain(graphDataforGoogleChartsArraySorted[i].rows)
//                    .flatten()
//                    .pluck('c')
//                    .map(function(num) {
//                        return { val : num[1].v }
//                    })
//                    .reduce(function(sum, num) {
//                        return sum = sum + num.val
//                    },0)
//                    .value()
//
//                switch (tickMode) {
//                    case 'days' :
//                        var weekDivisor = specFuncs.getWeeksInMonth(startDate.split('-')[0], startDate.split('-')[1]);
//                        avgInches = Math.round(totalPrinted / weekDivisor);
//                        avgInchestext = 'Avg. Inches/wk';
//                        chartType = 'ColumnChart';
//                        break;
//                    case 'weeks' :
//                        avgInches = Math.round(totalPrinted / 7);
//                        avgInchestext = 'Avg. Inches/day';
//                        chartType = 'ColumnChart';
//                        break;
//                    case 'hours' :
//                        avgInches = Math.round(totalPrinted / 24);
//                        avgInchestext = 'Avg. Inches/hr';
//                        chartType = 'AreaChart';
//                        break;
//                    case 'singlehour' :
//                        avgInches = totalPrinted;
//                        avgInchestext = 'Avg. Inches/hr';
//                        chartType = 'ColumnChart';
//                        break;
//                }
//                deviceConnected = 1; // It will always be 1 since it is for separately displayed printer
////                    graphDataforGoogleChartsArray[i].rows[0].c.unshift({}); // Google Charts requires an empty object at the beginning of data
//
//                tmpScopeDeviceModel.push( {
//                    modelOrLocation : graphDataforGoogleChartsArraySorted[i].rows[0].c[0].id,
//                    location : graphDataforGoogleChartsArraySorted[i].rows[0].c[0].location,
//                    chart : grapherFunction(graphDataforGoogleChartsArraySorted[i], chartColors[color], startDate, totalDays, tickMode, false, chartType, legendPosition),
//                    leftCellNumber : avgInches,
//                    middleCellNumber : totalPrinted,
//                    rightCellNumber : deviceConnected,
//                    leftCellText : avgInchestext,
//                    middleCellText :  "Total Inches Printed",
//                    rightCellText : deviceConnected > 1 ? "Devices Connected" : "Device Connected",
//                    dotColor : chartColors[color]
//                } );
//            }
//            return tmpScopeDeviceModel;
//        },

        generateDailyGraphForSelectedAvatars : function(grapherFunction, data, startDate, totalDays, tickMode, legendPosition) {

            var graphDataforGoogleChartsArray = [], tmpScopeDeviceModel = [], chartType;
            var outputPostDateRange = _.chain(data[0].dates)
                .map(function(d) {
                    return _.map(d.devices, function(eachDevice) {
                        return {
                            deviceModel : eachDevice.deviceModel,
                            location: eachDevice.location,
                            odometerInchesPrinted: eachDevice.odometerInchesPrinted,
                            avatarResourceId: eachDevice.avatarResourceId,
                            udi: eachDevice.udi,
                            datetime: d.datetime
                        }
                    })
                })
                .flatten()
                .groupBy('udi')
                .map(function(n) {
                    return _.map(n, function(device) {
                        var tmp = [];
                        // TODO Jan 8: Will keep these 3 lines of code
//                        var year = parseInt(device.datetime.split('-')[0]);
//                        var month = parseInt(device.datetime.split('-')[1])-1;
//                        var day = parseInt(device.datetime.split('-')[2]);
                        // TODO Jan 8: keeping this code. Reqquired by 3 lines above. MomentJS though rocks and is better
//                        tmp.push( { "v": device.datetime.indexOf('Z') == -1 ? new Date(year, month, day, 0, 0, 0) : new Date(device.datetime), id : retrieveMappedName(device.avatarResourceId, device.udi), location : device.location } );
                        tmp.push( { "v": moment(device.datetime).toDate(), id : retrieveMappedName(device.avatarResourceId, device.udi), location : device.location } );
                        tmp.push( { "v" : parseInt(device.odometerInchesPrinted), "f" : device.odometerInchesPrinted + (device.odometerInchesPrinted > 0 ? " inches" : " inch") } )
                        return { c : tmp };
                    })
                })
                .value()

            function to_date(o) {
                o.c[0].v = new Date(o.c[0].v);
                return o;
            }
            function asc_start_time(o) {
                return o.c[0].v.getTime();
            }

            outputPostDateRange.forEach(function(gChartData) {
                var sortedGoogleChart = _.chain(gChartData)
                    // TODO Jan 8: commenting out temporarily because we are doing a moment on date above
                    // Will delete when Gayana says everything is working great. So far, there shouldn't be any issues
                    // .map(to_date)
                    .sortBy(asc_start_time)
                    .value();

                graphDataforGoogleChartsArray.push({
                    "cols": [
                        {
                            "id": "datetime-id",
                            "label": "datetime",
                            "type": "datetime"
                        },
                        {
                            "id": "odometerInchesPrinted-id",
                            "label": "odometerInchesPrinted",
                            "type": "number"
                        }
                    ],
                    "rows" : sortedGoogleChart

                })
            })

            graphDataforGoogleChartsArraySorted = _.chain(graphDataforGoogleChartsArray)
                .sortBy(function (d) {
                    return d.rows[0].c[0].id.toLowerCase()
                })
                .value()

            for ( i = 0; i < graphDataforGoogleChartsArraySorted.length; i++ ) {
                color = i % 5;
                var totalPrinted = 0, avgInches = 0;
                totalPrinted = _.chain(graphDataforGoogleChartsArraySorted[i].rows)
                    .flatten()
                    .pluck('c')
                    .map(function(num) {
                        return { val : num[1].v }
                    })
                    .reduce(function(sum, num) {
                        return sum = sum + num.val
                    },0)
                    .value()

                switch (tickMode) {
                    case 'days' :
                        var weekDivisor = specFuncs.getWeeksInMonth(startDate.split('-')[0], startDate.split('-')[1]);
                        avgInches = Math.round(totalPrinted / weekDivisor);
                        avgInchestext = 'Avg. Inches/wk';
                        chartType = 'ColumnChart';
                        break;
                    case 'weeks' :
                        avgInches = Math.round(totalPrinted / 7);
                        avgInchestext = 'Avg. Inches/day';
                        chartType = 'ColumnChart';
                        break;
                    case 'hours' :
                        avgInches = Math.round(totalPrinted / 24);
                        avgInchestext = 'Avg. Inches/hr';
                        chartType = 'AreaChart';
                        break;
                    case 'singlehour' :
                        avgInches = totalPrinted;
                        avgInchestext = 'Avg. Inches/hr';
                        chartType = 'ColumnChart';
                        break;
                }
                deviceConnected = 1; // It will always be 1 since it is for separately displayed printer
//                    graphDataforGoogleChartsArray[i].rows[0].c.unshift({}); // Google Charts requires an empty object at the beginning of data
                tmpScopeDeviceModel.push( {
                    modelOrLocation : graphDataforGoogleChartsArraySorted[i].rows[0].c[0].id,
                    location : graphDataforGoogleChartsArraySorted[i].rows[graphDataforGoogleChartsArraySorted[i].rows.length-1].c[0].location,
                    chart : grapherFunction(graphDataforGoogleChartsArraySorted[i], chartColors[color], startDate, totalDays, tickMode, false, chartType, legendPosition),
                    leftCellNumber : avgInches,
                    middleCellNumber : totalPrinted,
                    rightCellNumber : deviceConnected,
                    leftCellText : avgInchestext,
                    middleCellText :  "Total Inches Printed",
                    rightCellText : deviceConnected > 1 ? "Devices Connected" : "Device Connected",
                    dotColor : chartColors[color]
                } );
            }
            return tmpScopeDeviceModel;
        },

        generateDailyGraphForSelectedRFIDAvatars : function(grapherFunction, data, startDate, totalDays, tickMode, isStacked, chartType, legendPosition) {

            var graphDataforGoogleChartsArray = [], tmpScopeDeviceModel = [];
            var outputPostDateRange = _.chain(data[0].dates)
                .map(function(d) {
                    return _.map(d.devices, function(eachDevice) {
                        return {
                            deviceModel : eachDevice.deviceModel,
                            location: eachDevice.location,
                            odometerRfidValid : eachDevice.odometerRfidValid,
                            odometerRfidVoid : eachDevice.odometerRfidVoid,
                            avatarResourceId: eachDevice.avatarResourceId,
                            udi: eachDevice.udi,
                            datetime: d.datetime
                        }
                    })
                })
                .flatten()
                .groupBy('udi')
                .map(function(n) {
                    return _.map(n, function(device) {
                        var tmp = [];
                        // TODO Jan 8: commenting out because we are doing a moment on date above
//                        var year = parseInt(device.datetime.split('-')[0]);
//                        var month = parseInt(device.datetime.split('-')[1])-1;
//                        var day = parseInt(device.datetime.split('-')[2]);
                        // TODO Jan 8: keeping this code. Reqquired by 3 lines above. MomentJS though rocks and is better
//                        tmp.push( { "v": device.datetime.indexOf('Z') == -1 ? new Date(year, month, day, 0, 0, 0) : new Date(device.datetime), id : retrieveMappedName(device.avatarResourceId, device.udi), location : device.location } );
                        tmp.push( { "v": moment(device.datetime).toDate(), id : retrieveMappedName(device.avatarResourceId, device.udi), location : device.location } );
                        tmp.push( { "v" : parseInt(device.odometerRfidValid) } )
                        tmp.push( { "v" : parseInt(device.odometerRfidVoid) } )
                        return { c : tmp };
                    })
                })
                .value()

            function to_date(o) {
                o.c[0].v = new Date(o.c[0].v);
                return o;
            }
            function asc_start_time(o) {
                return o.c[0].v.getTime();
            }

            outputPostDateRange.forEach(function(gChartData) {

                if (tickMode == 'hours') {
                    // Generate 24 hours source as reference to find out which hours are missing
                    var time24hrs = [];
                    for (i = 0; i < 24; i++) { time24hrs.push((moment(gChartData[0].c[0].v).add(i,'hours').toString())) }

                    // Retrieve hours provided by API and convert to string
                    var timeFromJSON = []
                    for (i = 0; i < gChartData.length; i++) { timeFromJSON.push((moment(gChartData[i].c[0].v).toString())) }

                    // Retrieve missing hours
                    var missingHours = _.difference(time24hrs, timeFromJSON);

                    // Let's synthesize the missing data into our existing chart object
                    for (i = 0; i < missingHours.length; i++) {
                        gChartData.push({ c : [
                            { id : 'missing', v : moment(missingHours[i], 'ddd MMM DD YYYY HH:mm:ss ZZ').toDate() },
                            { v : null },
                            { v: null }
                        ]})
                    }
                }

                var sortedGoogleChart = _.chain(gChartData)
                    // TODO Jan 8: commenting out temporarily because we are doing a moment on date above
                    // Will delete when Gayana says everything is working great. So far, there shouldn't be any issues
                    // .map(to_date)
                    .sortBy(asc_start_time)
                    .value();

                graphDataforGoogleChartsArray.push({
                    "cols": [
                        {
                            "id": "datetime-id",
                            "label": "datetime",
                            "type": "datetime"
                        },
                        {
                            "id": "odometerRfidValid-id",
                            "label": "RFID Success",
                            "type": "number"
                        },
                        {
                            "id": "odometerRfidVoid-id",
                            "label": "RFID Failed",
                            "type": "number"
                        }
                    ],
                    "rows" : sortedGoogleChart

                })
            })

            graphDataforGoogleChartsArraySorted = _.chain(graphDataforGoogleChartsArray)
                .sortBy(function (d) {
                    return d.rows[0].c[0].id.toLowerCase()
                })
                .value()

            for ( i = 0; i < graphDataforGoogleChartsArraySorted.length; i++ ) {
                color = i % 5;
                var totalPrinted = 0, avgInches = 0;

                totalRfidValid = _.reduce(graphDataforGoogleChartsArraySorted[i].rows,function(sum, num) { return sum = sum + num.c[1].v }, 0);
                totalRfidVoid = _.reduce(graphDataforGoogleChartsArraySorted[i].rows,function(sum, num) { return sum = sum + num.c[2].v }, 0);
                totalValidVoid = totalRfidValid + totalRfidVoid;

                tmpScopeDeviceModel.push( {
                    modelOrLocation : graphDataforGoogleChartsArraySorted[i].rows[0].c[0].id,
                    location : graphDataforGoogleChartsArraySorted[i].rows[0].c[0].location,
                    chart : grapherFunction(graphDataforGoogleChartsArraySorted[i], chartColors[color], startDate, totalDays, tickMode, isStacked, chartType, legendPosition),
                    leftCellNumber : totalRfidValid,
                    middleCellNumber : totalRfidVoid,
                    rightCellNumber : totalValidVoid,
                    leftCellText : 'RFID Success',
                    middleCellText :  'RFID Failed',
                    rightCellText : 'RFID Total',
                    dotColor : chartColors[color]
                } );
            }
            return tmpScopeDeviceModel;
        },

        convertJsontoGoogleChartData : function(grapherFunction, data, modelLocation, sortKey, mode, startDate, totalCols, propertyMapper, isStacked, chartType, legendPosition, interpolate, isCustom)  {
            var tmpScopeDeviceModel = [];
            var suffix, type, divisor, avgInchestext;
            if (mode == 'weeks') {
                suffix = ' 00:00:00';
                type = 'date';
                divisor = 7;
                avgInchestext = "Avg. Inches/day";
            } else
            if (mode == 'days') {
                suffix = ' 00:00:00';
                type = 'datetime';
                divisor = 24;
                avgInchestext = "Avg. Inches/hr";
            } else
            if (mode == 'hours') {
                suffix = '';
                type = 'datetime';
                divisor = 24;
                avgInchestext = "Avg. Inches/hr";
            }

            function prepareColsForGC (propertyMap) {
                var o = [];
                o.push({
                    "id": "datetime-id",
                    "label": "datetime",
                    "type": type
                })
                _.each(propertyMap, function(srcKey, dstKey) {
                    if (propertyMapper == RFIDPropertyMap) {
                        if (srcKey == 'odometerRfidValid') {
                            srcKey = 'RFID Success '
                        } else if (srcKey == 'odometerRfidVoid') {
                            srcKey = 'RFID Failed '
                        }
                    }
                    o.push({
                        id : srcKey + "-id",
                        label : srcKey,
                        type: "number"
                    });
                });

                return o;
            }

            var cols = prepareColsForGC(propertyMapper);

            function sum (a, b) { return a + b; }

            function sumProperty (arrayOfObjects, property) {

                // This code will not calculate null values. It's required if we want to see broken connection in the chart
                // This will instead return null and with Google Chart's interpolateNulls set to false,
                // missing datapoints will not be shown as broken link. GC will not connect points together
                if (_.uniq(_.pluck(arrayOfObjects, property))[0] == null && _.uniq(_.pluck(arrayOfObjects, property)).length === 1) {
                    return null;
                }

                return _.reduce(_.pluck(arrayOfObjects, property), sum, 0);
            }

            function sumPropertyMap (propertyMap, arrayOfObjects) {
                var o = {};
                _.each(propertyMap, function(srcKey, dstKey) {
                    o[dstKey] = sumProperty(arrayOfObjects, srcKey);
                });

                return o;
            }

            function prepareRowsForGC (propertyMap, arrayOfObjects) {
                var o = [];
                _.each(propertyMap, function(srcKey, dstKey) {
                    if (propertyMapper == RFIDPropertyMap) {
                        o.push({v : arrayOfObjects[dstKey] });
                    } else {
                        o.push({v : arrayOfObjects[dstKey], f : arrayOfObjects[dstKey] + " inches"});
                    }
                });

                return o;
            }

            var transformDeviceModels = function(dates) {

                return _.map(dates[modelLocation], function(deviceModel) {
                    var object = sumPropertyMap(propertyMapper, deviceModel.devices);
                    object.date = dates.datetime;
                    object[sortKey] = deviceModel[sortKey];

                    return object;
                });
            };

            var transformToGC = function(printers, device) {
                return _.map(printers, function(model) {
                    var object = prepareRowsForGC(propertyMapper, model);
                    object.unshift({
                        v : moment(model.date + suffix).toDate(),
                        id : sortKey == 'location' ? model[sortKey].toUpperCase() : model[sortKey]
                    });
                    return { c : object }
                })
            };

            var googleChartData = _.chain(data[0].dates)
                .map(transformDeviceModels)
                .flatten()
                .sortBy(sortKey)
                .groupBy(function(value) {
                    if (sortKey == 'location' ) {
                        return value[sortKey].toUpperCase();
                    } else {
                        return value[sortKey];
                    }
                })
                .map(transformToGC)
                .value();

            function to_date(o) {
                o.c[0].v = new Date(o.c[0].v);
                return o;
            }

            function asc_start_time(o) {
                return o.c[0].v.getTime();
            }

            var graphDataforGoogleChartsArray = [];

            _.forEach(googleChartData, function(charts) {

                // Let's only synthesize when request is hourly
                if (mode == 'hours' && interpolate) {
                    // Generate 24 hours source as reference to find out which hours are missing
                    var time24hrs = [];
                    for (i = 0; i < 24; i++) { time24hrs.push((moment(charts[0].c[0].v).add(i,'hours').toString())) }

                    // Retrieve hours provided by API and convert to string
                    var timeFromJSON = []
                    for (i = 0; i < charts.length; i++) { timeFromJSON.push((moment(charts[i].c[0].v).toString())) }

                    // Retrieve missing hours
                    var missingHours = _.difference(time24hrs, timeFromJSON);

                    // Let's synthesize the missing data into our existing chart object
                    for (i = 0; i < missingHours.length; i++) {
                        if (propertyMapper == NonRFIDPropertyMap) {
                            charts.push({ c : [
                                { id : 'missing', v : moment(missingHours[i], 'ddd MMM DD YYYY HH:mm:ss ZZ').toDate() },
                                { f : null, v : null }
                            ]})
                        } else if (propertyMapper == RFIDPropertyMap) {
                            charts.push({ c : [
                                { id : 'missing', v : moment(missingHours[i], 'ddd MMM DD YYYY HH:mm:ss ZZ').toDate() },
                                { v : null },
                                { v: null }
                            ]})
                        }
                    }
                }

                var sortedGoogleChart = _.chain(charts)
                    // TODO Jan 8: commenting out temporarily because we are doing a moment on date above
                    // Will delete when Gayana says everything is working great. So far, there shouldn't be any issues
                    //  .map(to_date)
                    .sortBy(asc_start_time)
                    .value();

                graphDataforGoogleChartsArray.push({ cols : cols, rows : sortedGoogleChart });
            })

            var deviceCountPerLocation = _(data[0].dates)
                .pluck(modelLocation)
                .flatten()
                .pluck('devices')
                .flatten()
                .groupBy(function(value) {
                    if (sortKey == 'location' ) {
                        return value[sortKey].toUpperCase();
                    } else {
                        return value[sortKey];
                    }
                })
                .mapValues(function (devicesForLocation) {
                    return _(devicesForLocation)
                        .pluck('udi')
                        .uniq()
                        .value()
                        .length;
                })
                .value()

            graphDataforGoogleChartsArraySorted = _.chain(graphDataforGoogleChartsArray)
                .sortBy(function (d) {
                    return d.rows[0].c[0].id.toLowerCase()
                })
                .value()

            for ( i = 0; i < graphDataforGoogleChartsArraySorted.length; i++ ) {
                color = i % 5;
                var totalPrinted = 0, avgInches = 0, deviceConnected = 0;

                if (propertyMapper == NonRFIDPropertyMap) {
                    totalPrinted = _.reduce(graphDataforGoogleChartsArraySorted[i].rows,function(sum, num) { return sum = sum + num.c[1].v }, 0);
                    deviceConnected = deviceCountPerLocation[graphDataforGoogleChartsArraySorted[i].rows[0].c[0].id];
                    avgInches = Math.round(totalPrinted / divisor);

                    // avg inches
                    leftCellNumber = avgInches;
                    // total inches printed
                    middleCellNumber = totalPrinted;
                    // devices connected
                    rightCellNumber = deviceConnected;
                    leftCellText = avgInchestext;
                    middleCellText = 'Total Inches Printed';
                    rightCellText = deviceConnected > 1 ? "Devices Connected" : "Device Connected";

                } else
                if (propertyMapper == RFIDPropertyMap) {

                    var totalRfidValid = 0, totalRfidVoid = 0, totalValidVoid = 0;
                    totalRfidValid = _.reduce(graphDataforGoogleChartsArraySorted[i].rows,function(sum, num) { return sum = sum + num.c[1].v }, 0);
                    totalRfidVoid = _.reduce(graphDataforGoogleChartsArraySorted[i].rows,function(sum, num) { return sum = sum + num.c[2].v }, 0);
                    totalValidVoid = totalRfidValid + totalRfidVoid;

                    // totalRfidValid
                    leftCellNumber = totalRfidValid;
                    // totalRfidVoid
                    middleCellNumber = totalRfidVoid;
                    // totalValidVoid
                    rightCellNumber = totalValidVoid;
                    leftCellText = 'RFID Success';
                    middleCellText = 'RFID Failed';
                    rightCellText = 'RFID Total';

                }

                tmpScopeDeviceModel.push( {
                    modelOrLocation : graphDataforGoogleChartsArraySorted[i].rows[0].c[0].id,
                    chart : grapherFunction(graphDataforGoogleChartsArraySorted[i], chartColors[color], startDate, totalCols, mode, isStacked, chartType, legendPosition, isCustom),
                    leftCellNumber : leftCellNumber,
                    middleCellNumber : middleCellNumber,
                    rightCellNumber : rightCellNumber,
                    leftCellText : leftCellText,
                    middleCellText : middleCellText,
                    rightCellText : rightCellText,
                    dotColor : chartColors[color]
                } );
            }
            return tmpScopeDeviceModel;

        }
    }

}])




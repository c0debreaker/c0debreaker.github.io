//function plotBarStackedChartTemplate(jsonData, headerTitle) {
//
//    var centerValue = 0;
//    var parentArray = [];
//    var childArray = [];
//    var categories = [];
//    var loopCtr = 0;
//    var fields = [].slice.call(arguments, 1);
//
//    for (var i = 0; i < jsonData.length; i++  ) {
//
//        for (var x = 0; x < fields.length; x++ ) {
//        }
//    }
//    jsonData.forEach(function(a) {
//        fields.forEach(function(f) {
//            if (loopCtr > 0 ) {  // bypass the panel title
//                if (loopCtr == 1) {
//                    categories.push(a[f]);
//                    childArray.push(a[f]); // This is the name
//                } else {                   // these are the performance counters
//                    childArray.push(parseInt(a[f])); //This is the value
//                    centerValue = centerValue + parseInt(a[f]);
//                }
//            }
//            loopCtr++;
//
//        })
//        parentArray.push(childArray);
//        childArray = [];
//        loopCtr = 0;
//    })
//
//    var arrb = [];
//    var arr = parentArray;
//    var nTemp = [];
//    for(x=0;x<arr.length;x++) {
//        for(y=0;y<arr[x].length;y++) {
//            if (y == 0 ) {
//                tmp = { name: arr[x][y], data: [] }
//                nTemp.push(tmp);
//            }
//            arrb[y] = typeof(arrb[y])=='undefined'?[] : arrb[y];
//            arrb[y][x] = arr[x][y]
//        }
//    }
//
//    var i = 0;
//    for (x = 0; x < arrb.length;x++) {
//        if (x > 0) {
//            nTemp[i].data = arrb[x];
//            i++;
//        }
//    }
//
//    var tmp = {};
//    var newArray = [];
//
//    for (var i = 0; i < parentArray.length; i++) {
//        for (var y = 0; y < fields.length-1; y++) {
//            if (y == 0) {
//                tmp = { name : parentArray[i][y], data: []};
//                newArray.push(tmp);
//            }
//            else {
//                newArray[i].data.push(parentArray[i][y]);
//            }
//        }
//    }
//
//    var chartConfig = {
//        title: {
//            text: headerTitle
//        },
//        xAxis: {
//            categories: categories
//        },
//        yAxis: {
//            min: 0,
//            title: {
//                text: 'Bytes Used'
//            },
//            stackLabels: {
//                enabled: false,
//                style: {
//                    fontWeight: 'bold',
//                    color: 'gray'
//                }
//            }
//        },
////        legend: {
////            align: 'right',
////            x: 0,
////            verticalAlign: 'top',
////            y: 0,
////            floating: true,
////            backgroundColor: 'white',
////            borderColor: '#CCC',
////            borderWidth: 1,
////            shadow: false
////        },
//        tooltip: {
//            formatter: function() {
//                return '<b>'+ this.x +'</b><br/>'+
//                    this.series.name +': '+ this.y +'<br/>'+
//                    'Total: '+ this.point.stackTotal;
//            }
//        },
//
//        series: nTemp
//    }
//
//    return chartConfig;
//}
//
//function plotColumnChart(jsonData) {
//    var chartConfig =
//    {
//        title: {
//            text: 'Historic World Population by Region'
//        },
//        subtitle: {
//            text: 'Source: Wikipedia.org'
//        },
//        xAxis: {
//            categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania', 'Oceania', 'Oceania', 'Oceania', 'Oceania', 'Oceania', 'Oceania', 'Oceania', 'Oceania', 'Oceania', 'Oceania', 'Oceania', 'Oceania', 'Oceania', 'Oceania'],
//            title: {
//                text: null
//            }
//        },
//        yAxis: {
//            min: 0,
//            title: {
//                text: 'Population (millions)',
//                align: 'high'
//            },
//            labels: {
//                overflow: 'justify'
//            }
//        },
//        tooltip: {
//            valueSuffix: ' millions'
//        },
//        plotOptions: {
//            bar: {
//                dataLabels: {
//                    enabled: true,
//                    style: {
//                        fontSize: "10px",
//                    }
//                }
//            }
//        },
//        legend: {
//            layout: 'vertical',
//            align: 'right',
//            verticalAlign: 'top',
//            x: -100,
//            y: 100,
//            floating: true,
//            borderWidth: 1,
//            backgroundColor: '#FFFFFF',
//            shadow: true
//        },
//        credits: {
//            enabled: false
//        },
//        series: [{
//
//            type : 'bar',
//            name: 'Year 1800',
//            data: [107, 31, 635, 203,  2, 203, 203, 203, 203,203, 203, 203, 203, 203, 203, 203]
//        }, {
//            type : 'bar',
//            name: 'Year 1900',
//            data: [133, 156, 947, 408, 6, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203]
//        }, {
//            type : 'bar',
//            name: 'Year 2008',
//            data: [973, 914, 4054, 732, 34, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203]
//        }]
//    };
//    return chartConfig;
//
//}
//
//function plotPieChartTemplate(jsonData, headerTitle) {
//
//    var centerValue = 0;
//    var parentArray = [];
//    var childArray = [];
//    var loopCtr = 0;
//    var fields = [].slice.call(arguments, 1);
//
//    jsonData.forEach(function(a) {
//        fields.forEach(function(f) {
//            if (loopCtr == 0) {
//
//            } else
//            if (loopCtr == 1) {
//                childArray.push(a[f]); // This is the name
//            } else
//            if (loopCtr > 1) {
//                childArray.push(parseInt(a[f])); //This is the value
//                centerValue = centerValue + parseInt(a[f]);
//            }
//            loopCtr++;
//        })
//        parentArray.push(childArray);
//        childArray = [];
//        loopCtr = 0;
//    })
//
//    var chartConfig = {};
//
//    chartConfig = {
////        options: {
////            chart: {
////                type: 'column'
////            }
////        },
//        chart: {
//            plotBackgroundColor: null,
//            plotBorderWidth: null,
//            plotShadow: false
//        },
//
//        title: {
//            text: headerTitle //,
////            style: {
////                color: '#777777',
////                fontWeight: 'bold',
////                fontSize: '13px'
////            },
////            align: 'center',
////            verticalAlign: 'middle',
////            y: 4
//        },
////        size: {
////            width: 120,
////            height: "100%"
////        },
////        options : {
////            plotOptions: {
////                pie: {
////                    allowPointSelect: true,
////                    cursor: 'pointer',
////                    depth: 35,
////                    dataLabels: {
////                        enabled: true,
////                        format: '{point.name}'
////                    }
////                }
////            },
////        },
////        xAxis: {
////            categories: ['1750', '1800', '1850', '1900', '1950', '1999', '2050'],
////            tickmarkPlacement: 'on',
////            title: {
////                enabled: false
////            }
////        },
//        xAxis: {
//            type: 'category',
//            labels: {
//                enabled: false,
//                rotation: -75,
//                align: 'right',
//                style: {
//                    fontSize: '11px',
//                    fontFamily: 'Verdana, sans-serif'
//                }
//            }
//        },
//        yAxis: {
//            min: 0,
//            title: {
//                text: 'Number of Bytes per Member(bytes)'
//            }
//        },
//        legend: {
//            enabled: true
//        },
//        series: [{
//            type: 'column',
//            name: '',
//            tooltip: {
//                pointFormat: 'Value: <b>{point.y}</b>'
//            },
//            data : parentArray,
////            colors: ['#3c3e41',
////                '#fcb100',
////
////                '#52758b',
////                '#759bb3',
////                '#5d6735',
////                '#c7a044',
////                '#8b8a3e',
////                '#f5b825',
////                '#2FAACE'
////            ],
////            colors: ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"], // colors for pie chart
//            color: "#d0743c", //color for column
//            dataLabels : {
//                enabled: true,
//                crop: true,
//                rotation: -90,
//                color: '#FFFFFF',
//                align: 'right',
//                x: 2,
//                y: 4,
//                style: {
//                    fontSize: '8px',
//                    fontFamily: 'Verdana, sans-serif',
//                    textShadow: '0 0 1px black'
//                }
//            },
//            allowPointSelect: false,
//            cursor: 'pointer',
//            depth: 1//,
////            dataLabels: {
////                enabled: false
////            }
//
//        }]
//    }
//    return chartConfig;
//}
//
//function plotp() {
//    var chartConfig = {
//        chart: {
////            renderTo: 'container',
//
//            margin: [0, 0, 0, 0],
//            spacingTop: 0,
//            spacingBottom: 0,
//            spacingLeft: 0,
//            spacingRight: 0
//        },
//        credits: {
//            enabled: false
//        },
//        title: {
//            text: null
//        },
//        plotOptions: {
//            pie: {
//                size:'10%',
//                dataLabels: {
//                    enabled: false
//                }
//            }
//        },
//        series: [{
//            type: 'pie',
//            name: 'Months',
//            data: [
//                ['Jan', 45.0],
//                ['Feb', 26.8],
//                ['Mar', 8.5],
//                ['June', 6.2],
//                ['July', 21.0]
//            ]}]
//    };
//    return chartConfig;
//}
//
//function plotDonutChartTemplate(jsonData) {
//
//    var centerValue = 0;
//    var parentArray = [];
//    var childArray = [];
//    var loopCtr = 0;
//    var fields = [].slice.call(arguments, 1);
//    jsonData.forEach(function(a) {
//        fields.forEach(function(f) {
//            if (loopCtr == 0) {
//                childArray.push(a[f]); // This is the name
//            } else {
//                childArray.push(parseInt(a[f])); //This is the value
//                centerValue = centerValue + parseInt(a[f]);
//            }
//            loopCtr++;
//        })
//        parentArray.push(childArray);
//        childArray = [];
//        loopCtr = 0;
//    })
//
//    var chartConfig = {};
//    chartConfig = {
//        chart: {
//            plotBackgroundColor: null,
//            plotBorderWidth: null,
//            plotShadow: false
//        },
//        title: {
//            text: centerValue.toString(),
//            style: {
//                color: '#777777',
//                fontWeight: 'bold',
//                fontSize: '13px'
//            },
//            align: 'center',
//            verticalAlign: 'middle',
//            y: 4
//        },
//        size: {
//            width: 125,
//            height: 125
//        },
//        series: [{
//            type: 'pie',
//            name: '',
//            innerSize: '100%',
//            tooltip: {
//                pointFormat: 'Value: <b>{point.y}</b>'
//            },
//            margin: [0, 0, 0, 0],
//            spacingTop: 0,
//            spacingBottom: 0,
//            spacingLeft: 0,
//            spacingRight: 0,
//            plotOptions: {
////                pie: {
////                    size:'30%',
////                    dataLabels: {
////                        enabled: false
////                    }
////                }
//            },
//            data : parentArray,
////            colors:
////                [
////                '#fcb100',
////                '#3c3e41',
////                '#52758b',
////                '#759bb3',
////                '#5d6735',
////                '#c7a044',
////                '#8b8a3e',
////                '#f5b825',
////                '#2FAACE'
////            ],
//            colors: ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"],
//            allowPointSelect: true,
//            cursor: 'pointer',
//            pie: {
//                size:'30%',
//                dataLabels: {
//                    enabled: false
//                }
//            },
//            dataLabels: {
//                enabled: false
//            }
//
//        }]
//    }
//}
//
//function plotDonutChartTemplateForGoogleCharts(jsonData, w, h) {
//
//    var centerValue = 0;
//    var parentArray = [['C', 'cost']];
//    var childArray = [];
//    var loopCtr = 0;
//    var fields = [].slice.call(arguments, 3);
//    jsonData.forEach(function(a) {
//        fields.forEach(function(f) {
//            if (loopCtr == 0) {
//                childArray.push(a[f]); // This is the name
//            } else {
//                childArray.push(parseInt(a[f])); //This is the value
//                centerValue = centerValue + parseInt(a[f]);
//            }
//            loopCtr++;
//        })
//        parentArray.push(childArray);
//        childArray = [];
//        loopCtr = 0;
//    })
//
//    var googleChart = {};
//    googleChart.type = "PieChart";
//
//    googleChart.data = parentArray;
//    googleChart.options = {
//        displayExactValues: false,
//        width: w, //130
//        height: h, //120
//        is3D: true,
//        pieHole: 0.4,// will make a donut pie
//        colors: ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"],
//        chartArea: {left:10,top:3, bottom:0,width:"90%",height:"90%"},
//        legend: { position: 'none'}
//    };
//
////    googleChart.formatters = {
////        number : [{
////            columnNum: 1,
////            pattern: "$ #,##0.00"
////        }]
////    };
//
//    return googleChart;
//}
//
//function plotDonutChartCassandraGoogleCharts(jsonData, w, h) {
//
//    var centerValue = 0;
//    var parentArray = [['C', 'UDI']];
//    var childArray = [];
//    var loopCtr = 0;
//    var fields = [].slice.call(arguments, 3);
//    jsonData.forEach(function(a) {
//        fields.forEach(function(f) {
//            if (loopCtr == 0) {
//                childArray.push(a[f]); // This is the name
//            } else {
//                childArray.push(parseInt(a[f])); //This is the value
//                centerValue = centerValue + parseInt(a[f]);
//            }
//            loopCtr++;
//        })
//        parentArray.push(childArray);
//        childArray = [];
//        loopCtr = 0;
//    })
//
//    var googleChart = {};
//    googleChart.type = "AreaChart";
//    googleChart.title = {
//        text: "Daily Usage",
//        style: {
//            color: '#777777',
//            fontWeight: 'bold',
//            fontSize: '13px'
//        },
//        align: 'center',
//        verticalAlign: 'middle',
//        y: 4
//    };
//
//    googleChart.data = parentArray;
//
//    googleChart.xAxis = {
//        type: 'category',
//        labels: {
//            enabled: true,
//            rotation: 0,
//            align: 'right',
//            style: {
//                fontSize: '11px',
//                fontFamily: 'Verdana, sans-serif'
//            }
//        }
//    };
//
//    googleChart.options = {
//        displayExactValues: false,
//        width: w, //130
//        height: h, //120
////        is3D: true,
//        pieHole: 0.4,// will make a donut pie
//        //   colors: ["#f9b806", "#fabe0f", "#fdd534", "#fdf469", "#e6f06c", "#bcdd6b", "#a4d266"],
//        colors: ["#ff8c00", "#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c" ],
//        //   colors: ["#FF99FF","#FF9999","#FF9966","#FF9933","#FF9900","#FFCC00","#FFCC33","#FFCC66","#FFCC99","#FFCCCC","#FFCCFF","#FFFFFF"],
////        chartArea: {left:10,top:3, bottom:0,width:"90%",height:"90%"},
//        legend: { position: 'right'},
//        title : "Device Daily Usage per UDI",
//        yAxis : {
//            min: 0,
//            title: 'Number of Bytes per Member(bytes)'
//
//        }
//    };
//
////    googleChart.formatters = {
////        number : [{
////            columnNum: 1,
////            pattern: "$ #,##0.00"
////        }]
////    };
//
//    return googleChart;
//}
//
//function plotDailyAreaChartCassandraGoogleCharts(jsonData, w, h) {
//
//    var centerValue = 0;
//    var parentArray = [['C', 'UDI']];
//    var childArray = [];
//    var loopCtr = 0;
//    var fields = [].slice.call(arguments, 3);
//    jsonData.forEach(function(a) {
//        fields.forEach(function(f) {
//            if (loopCtr == 0) {
//                childArray.push(a[f]); // This is the name
//            } else if (loopCtr == 1) {
//                childArray.push(a[f]);
//            } else {
//                childArray.push(parseInt(a[f])); //This is the value
//                centerValue = centerValue + parseInt(a[f]);
//            }
//            loopCtr++;
//        })
//        parentArray.push(childArray);
//        childArray = [];
//        loopCtr = 0;
//    })
//
//    var googleChart = {};
//    googleChart.type = "AreaChart";
//    googleChart.title = {
//        text: "Daily Usage",
//        style: {
//            color: '#777777',
//            fontWeight: 'bold',
//            fontSize: '13px'
//        },
//        align: 'center',
//        verticalAlign: 'middle',
//        y: 4
//    };
//
//    googleChart.data = parentArray;
//
//    googleChart.xAxis = {
//        type: 'category',
//        labels: {
//            enabled: true,
//            rotation: 0,
//            align: 'right',
//            style: {
//                fontSize: '11px',
//                fontFamily: 'Verdana, sans-serif'
//            }
//        }
//    };
//
//    googleChart.options = {
//        displayExactValues: false,
//        width: w, //130
//        height: h, //120
////        is3D: true,
//        pieHole: 0.4,// will make a donut pie
//        //   colors: ["#f9b806", "#fabe0f", "#fdd534", "#fdf469", "#e6f06c", "#bcdd6b", "#a4d266"],
//        colors: ["#ff8c00", "#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c" ],
//        //   colors: ["#FF99FF","#FF9999","#FF9966","#FF9933","#FF9900","#FFCC00","#FFCC33","#FFCC66","#FFCC99","#FFCCCC","#FFCCFF","#FFFFFF"],
////        chartArea: {left:10,top:3, bottom:0,width:"90%",height:"90%"},
//        legend: { position: 'right'},
//        title : "Device Daily Usage per UDI",
//        yAxis : {
//            min: 0,
//            title: 'Number of Bytes per Member(bytes)'
//
//        }
//    };
//
////    googleChart.formatters = {
////        number : [{
////            columnNum: 1,
////            pattern: "$ #,##0.00"
////        }]
////    };
//
//    return googleChart;
//}
//
//
//function plotStackedColumnChartTemplateForGoogleCharts(jsonData) {
//
//    var parentArray = {},
//        loopCtr = 0,
//        allFieldsFromArguments = [].slice.call(arguments, 1),
//        chartTitle = allFieldsFromArguments.shift(), // Grabing first argument which is title
//        dataFields = allFieldsFromArguments,
//        tmpForCObjectArray = [],
//        rows = [],
//        cols = [];
//
//    jsonData.forEach(function(a) {
//        dataFields.forEach(function(f) {
//            if (loopCtr == 0) {
//                tmpForCObjectArray.push({v: a[f]});
//            } else {
//                tmpForCObjectArray.push({
//                    v: parseInt(a[f]),
//                    f: a[f] + " byte(s)"
//                });
//            }
//            loopCtr++;
//        })
//        rows.push({c : tmpForCObjectArray});
//        tmpForCObjectArray = []
//        loopCtr = 0;
//    })
//
//    for (var i=0; i < dataFields.length; i++) {
//        if (i == 0) {
//            cols.push({
//                    id: dataFields[i]+"-id",
//                    label: dataFields[i],
//                    type: "string"
//                }
//            );
//        } else {
//            cols.push({
//                    id: dataFields[i]+"-id",
//                    label: dataFields[i],
//                    type: "number"
//                }
//            );
//        }
//    }
//
//    parentArray = {
//        "cols": cols,
//        "rows": rows
//    }
//
//    var googleChart = {};
//    googleChart.type = "ColumnChart";
//    googleChart.displayed = true;
//    googleChart.data = parentArray;
//    googleChart.options = {
//        title: chartTitle,
//        displayExactValues: true,
//        fill: 20,
//        seriesType: "bars",
//        series: {2: { type: "area", curveType: 'function' }},
//
////        width: 130,
//        height: 400,
////        is3D: true,
//        isStacked: true,
////        pieHole: 0.4,// will make a donut pie
//        colors: ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"],
////        chartArea: {left:10,top:3, bottom:0,width:"90%",height:"90%"},
//        vAxis: {
//            //      viewWindow : { min : 0 , max : 800000 },
//
//            "title": "Traffic Usage (bytes)",
//            "gridlines": {
//                "count": -1
//            }
//        },
//        legend: { position: 'right'}
//    };
//
//    googleChart.formatters = {};
////    {
////        number : [{
////            columnNum: 1,
////            pattern: "#,##0"
////        }]
////    };
//
//    return googleChart;
//}
//function plotMonthlyChartForGoogleCharts(jsonData) {
//
//    var parentArray = {},
//        loopCtr = 0,
//        allFieldsFromArguments = [].slice.call(arguments, 1),
//        chartTitle = allFieldsFromArguments.shift(), // Grabing first argument which is title
//        dataFields = allFieldsFromArguments,
//        tmpForCObjectArray = [],
//        rows = [],
//        cols = [];
//
//    jsonData.forEach(function(a) {
//        dataFields.forEach(function(f) {
//            if (loopCtr == 0) {
//                tmpForCObjectArray.push({v: a[f]});
//            } else if (loopCtr == 1) {
//                tmpForCObjectArray[0].v =  tmpForCObjectArray[0].v + '-' + a[f];
//            } else {
//                tmpForCObjectArray.push({
//                    v: parseInt(a[f]),
//                    f: a[f] + " byte(s)"
//                });
//            }
//            loopCtr++;
//        })
//        rows.push({c : tmpForCObjectArray});
//        tmpForCObjectArray = []
//        loopCtr = 0;
//    })
//
//    for (var i=0; i < dataFields.length; i++) {
//        if (i == 0) {
//            cols.push({
//                    id: dataFields[i]+"-id",
//                    label: dataFields[i],
//                    type: "string"
//                }
//            );
//        } else if (i == 1) {
//        } else {
//            cols.push({
//                    id: dataFields[i]+"-id",
//                    label: dataFields[i],
//                    type: "number"
//                }
//            );
//        }
//    }
//
//    parentArray = {
//        "cols": cols,
//        "rows": rows
//    }
//
//    var googleChart = {};
//    googleChart.type = "ColumnChart";
//    googleChart.displayed = true;
//    googleChart.data = parentArray;
//    googleChart.options = {
//        title: chartTitle,
//        displayExactValues: true,
//        fill: 20,
//        seriesType: "bars",
//        series: {2: { type: "area", curveType: 'function' }},
//
////        width: 130,
//        height: 400,
////        is3D: true,
//        isStacked: true,
////        pieHole: 0.4,// will make a donut pie
//        colors: ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"],
////        chartArea: {left:10,top:3, bottom:0,width:"90%",height:"90%"},
//        vAxis: {
//            //      viewWindow : { min : 0 , max : 800000 },
//
//            "title": "Traffic Usage (bytes)",
//            "gridlines": {
//                "count": -1
//            }
//        },
//        legend: { position: 'right'}
//    };
//
//    googleChart.formatters = {};
////    {
////        number : [{
////            columnNum: 1,
////            pattern: "#,##0"
////        }]
////    };
//
//    return googleChart;
//}
//
//function plotDailyCassandraChart(jsonData) {
//
//    var parentArray = {},
//        loopCtr = 0,
//        allFieldsFromArguments = [].slice.call(arguments, 1),
//        chartTitle = allFieldsFromArguments.shift(), // Grabing first argument which is title
//        dataFields = allFieldsFromArguments,
//        tmpForCObjectArray = [],
//        rows = [],
//        cols = [];
//
//    jsonData.forEach(function(a) {
//        dataFields.forEach(function(f) {
//            if (loopCtr == 0) {   // user ie. Walmart
//                tmpForCObjectArray.push({ v : a[f] });
//            } else if (loopCtr == 1) { // udi ie. BestBuydev18
//                tmpForCObjectArray[0].v =  tmpForCObjectArray[0].v + '(' + a[f] +')';
//            } else if (loopCtr == 2) {
//
//                tmpForCObjectArray[0].v =  tmpForCObjectArray[0].v + ' - ' + a[f];
//            } else {
//                tmpForCObjectArray.push({
//                    v: parseInt(a[f]),
//                    f: a[f] + " byte(s)"
//                });
//            }
//            loopCtr++;
//        })
//        rows.push({c : tmpForCObjectArray});
//        tmpForCObjectArray = []
//        loopCtr = 0;
//    })
//
//    for (var i=0; i < dataFields.length; i++) {
//        if (i == 0) {
//            cols.push({
//                    id: dataFields[i]+"-id",
//                    label: dataFields[i],
//                    type: "string"
//                }
//            );
//        } else if (i == 1 || i == 2) {
//        } else {
//            cols.push({
//                    id: dataFields[i]+"-id",
//                    label: dataFields[i],
//                    type: "number"
//                }
//            );
//        }
//    }
//
//    parentArray = {
//        "cols": cols,
//        "rows": rows
//    }
//
//    var googleChart = {};
////    googleChart.type = "BarChart";
//    googleChart.type = "ColumnChart";
////    googleChart.type = "LineChart";
//    googleChart.displayed = true;
//    googleChart.data = parentArray;
//    googleChart.options = {
//        title: chartTitle + ' - ' + jsonData[0].udi,
//        displayExactValues: true,
//        fill: 20,
////        seriesType: "area",
//        seriesType: "bars",
////        series: {5: {type: "line"}},
////        series: {1: { type: "area", curveType: 'function' }},
//
//        width: 0,
//        height: 0,
////        is3D: true,
//        isStacked: true,
////        pieHole: 0.4,// will make a donut pie
//        colors: ["#fcb322", "#D7DF01",           "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"],
////        chartArea: {left:10,top:3, bottom:0,width:"90%",height:"90%"},
//        vAxis: {
//            //      viewWindow : { min : 0 , max : 800000 },
//
//            "title": "Data Usage (bytes)",
//            "gridlines": {
//                "count": -1
//            }
//        },
//        legend: { position: 'right'}
//    };
//
//    googleChart.formatters = {};
////    {
////        number : [{
////            columnNum: 1,
////            pattern: "#,##0"
////        }]
////    };
//    return googleChart;
//}
//
//function plotHourlyChartForGoogleCharts(jsonData) {
//
//    var parentArray = {},
//        loopCtr = 0,
//        allFieldsFromArguments = [].slice.call(arguments, 1),
//        chartTitle = allFieldsFromArguments.shift(), // Grabing first argument which is title
//        dataFields = allFieldsFromArguments,
//        tmpForCObjectArray = [],
//        rows = [],
//        cols = [];
//
//    jsonData.forEach(function(a) {
//        dataFields.forEach(function(f) {
//            if (loopCtr == 0) {
//                tmpForCObjectArray.push({ v : a[f] });
//            } else if (loopCtr == 1) {
//                tmpForCObjectArray[0].v =  tmpForCObjectArray[0].v + '(' + a[f] +')';
//            } else if (loopCtr == 2 || loopCtr == 3) {
//                tmpForCObjectArray[0].v =  tmpForCObjectArray[0].v + ' - ' + a[f];
//            } else {
//                tmpForCObjectArray.push({
//                    v: parseInt(a[f]),
//                    f: a[f] + " byte(s)"
//                });
//            }
//            loopCtr++;
//        })
//        rows.push({c : tmpForCObjectArray});
//        tmpForCObjectArray = []
//        loopCtr = 0;
//    })
//
//    for (var i=0; i < dataFields.length; i++) {
//        if (i == 0) {
//            cols.push({
//                    id: dataFields[i]+"-id",
//                    label: dataFields[i],
//                    type: "string"
//                }
//            );
//        } else if (i == 1 || i == 2 || i == 3) {
//        } else {
//            cols.push({
//                    id: dataFields[i]+"-id",
//                    label: dataFields[i],
//                    type: "number"
//                }
//            );
//        }
//    }
//
//    parentArray = {
//        "cols": cols,
//        "rows": rows
//    }
//
//    var googleChart = {};
////    googleChart.type = "AreaChart";
//    googleChart.type = "ColumnChart";
////    googleChart.type = "LineChart";
//    googleChart.displayed = true;
//    googleChart.data = parentArray;
//    googleChart.options = {
//        title: chartTitle,
//        displayExactValues: true,
//        fill: 20,
////        seriesType: "area",
//        //       seriesType: "bars",
////        series: {5: {type: "line"}},
////        series: {1: { type: "area", curveType: 'function' }},
//
////        width: 130,
//        height: 400,
////        is3D: true,
//        isStacked: true,
////        pieHole: 0.4,// will make a donut pie
//        colors: ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"],
////        chartArea: {left:10,top:3, bottom:0,width:"90%",height:"90%"},
//        vAxis: {
//            //      viewWindow : { min : 0 , max : 800000 },
//
//            "title": "",
//            "gridlines": {
//                "count": 10
//            }
//        },
//        legend: { position: 'right'}
//    };
//
//    googleChart.formatters = {};
////    {
////        number : [{
////            columnNum: 1,
////            pattern: "#,##0"
////        }]
////    };
//    return googleChart;
//}

function plotMonthlyNoWeekly_Lodash(jsonData, chartColor) {

    var parentArray = {},
        loopCtr = 0,
        allFieldsFromArguments = [].slice.call(arguments, 2),
        chartTitle = allFieldsFromArguments.shift(), // Grabing first argument which is title
        dataFields = allFieldsFromArguments,
        tmpForCObjectArray = [],
        rows = [],
        cols = [];

    var groupWidth;
    var deviceCount = jsonData.cols.length - 1;

    if (deviceCount >= window.GoogleCharts.columnChartSettings.LO_DEVICE_COUNT &&
        deviceCount <= window.GoogleCharts.columnChartSettings.HI_DEVICE_COUNT) {
        groupWidth = deviceCount * window.GoogleCharts.columnChartSettings.COLUMN_WIDTH;
    } else {
        groupWidth = window.GoogleCharts.columnChartSettings.DEFAULT_WIDTH;
    }

    var googleChart = {};
    googleChart.type = "ColumnChart";
    googleChart.displayed = true;
    googleChart.data = jsonData;
    googleChart.options = {
        displayExactValues: true,
//        fill: 20,
//        seriesType: "bars",
        width: 0,
        height: 0,
        isStacked: false,
        bar: { groupWidth : groupWidth },
        colors: [chartColor],
        vAxis: {
            "title": "", // x-axis text
            "minValue": 0
//            "gridlines": {
//                "count": 5
//            }
        } ,
        yAxis: {
            "title": "June 2014", // y-axis text
//            "gridlines": {
//                "count": 5
//            }
        } ,
        legend: { position: 'none'}
    };

    googleChart.formatters = {};
    return googleChart;
}

function plotWeekly_Lodash(jsonData, chartColor, startdate, totalCols, tickMode, isStacked, chartType, legendPosition) {

    var specFuncs = new Baam.SpecFuncs();
    secondColor = specFuncs.shadeColor('#BB6C5A', 0.3);

    var ticks = [];

    var allFieldsFromArguments = [].slice.call(arguments, 2),
        chartTitle = allFieldsFromArguments.shift(), // Grabing first argument which is title
        dataFields = allFieldsFromArguments,
        tmpForCObjectArray = [],
        rows = [],
        cols = [];

    for (var i = 0; i < 7; i++) {
        ticks.push(moment(startdate).add(i, 'days').toDate());
    }

    var groupWidth;
    groupWidth = window.GoogleCharts.columnChartSettings.COLUMN_WIDTH

    var googleChart = {};
    googleChart.type = chartType;
    googleChart.displayed = true;
    googleChart.data = jsonData;
    googleChart.options = {
        displayExactValues: true,
        fill: 20,
        seriesType: "bars",
        width: 0,
        height: 0,
        isStacked: isStacked,
        bar: { groupWidth: groupWidth },
        colors: [chartColor, secondColor], // '#FFB900'
        vAxis: {
            "title": "", // x-axis text
            "minValue": 0,
            "gridlines": {
                "count": 5
            }
        },
        hAxis: {
            format : 'MMM d yyyy',
            ticks: ticks,
            gridlines: {
                color: 'transparent'
            }
        },
        yAxis: {
            "title": "", // y-axis text
            "gridlines": {
                "count": 1
            }
        } ,
        legend: { position: legendPosition }
    };

    googleChart.formatters = {};
    return googleChart;
}

function plotHourly_Lodash(jsonData, chartColor, startdate, totalCols, tickMode, isStacked, chartType, legendPosition) {

    var specFuncs = new Baam.SpecFuncs();
    secondColor = specFuncs.shadeColor('#BB6C5A', 0.3);

    var parentArray = {},
        loopCtr = 0,
        allFieldsFromArguments = [].slice.call(arguments, 2),
        chartTitle = allFieldsFromArguments.shift(), // Grabbing first argument which is title
        dataFields = allFieldsFromArguments,
        tmpForCObjectArray = [],
        rows = [],
        cols = [],
        days,
        ticks,
        ticksB;

    ticks = [];
    var tickCount = 24;

    var spread = (totalCols / 8)
    ticks.push(moment(startdate).toDate());
    ticks.push( { v : moment(startdate).add(1 + Math.ceil(1 * spread) - 1, 'hours').toDate(), f : moment(startdate).add(1 + Math.ceil(1 * spread) - 1, 'hours').format('ha') });
    ticks.push( { v : moment(startdate).add(1 + Math.ceil(2 * spread) - 1, 'hours').toDate(), f : moment(startdate).add(1 + Math.ceil(2 * spread) - 1, 'hours').format('ha') });
    ticks.push( { v : moment(startdate).add(1 + Math.ceil(3 * spread) - 1, 'hours').toDate(), f : moment(startdate).add(1 + Math.ceil(3 * spread) - 1, 'hours').format('ha') });
    ticks.push(moment(startdate).add((4 * spread), 'hours').toDate());
    ticks.push( { v : moment(startdate).add(1 + Math.ceil(5 * spread) - 1, 'hours').toDate(), f : moment(startdate).add(1 + Math.ceil(5 * spread) - 1, 'hours').format('ha') });
    ticks.push( { v : moment(startdate).add(1 + Math.ceil(6 * spread) - 1, 'hours').toDate(), f : moment(startdate).add(1 + Math.ceil(6 * spread) - 1, 'hours').format('ha') });
    ticks.push( { v : moment(startdate).add(1 + Math.ceil(7 * spread) - 1, 'hours').toDate(), f : moment(startdate).add(1 + Math.ceil(7 * spread) - 1, 'hours').format('ha') });
    ticks.push(moment(startdate).add(24, 'hours').toDate());

    var googleChart = {};
    googleChart.type = chartType;
//    googleChart.displayed = true;
    googleChart.data = jsonData;
    googleChart.options = {
//        displayExactValues: true,
        interpolateNulls : false,
//        seriesType: "line",
//        curveType: 'function',
        lineWidth : 1,
        width: 0,
        height: 0,
        pointSize: 4,
        "isStacked" : isStacked,
        colors: [chartColor, secondColor], //'#FFB900'
//        colors: ['#FFB900', '#5D8B7B' ],
//        strictFirstColumnType: true,
        vAxis: {
            "title": "", // x-axis text
            "minValue": 0,
            "gridlines": {
                "count": 7
            }
        },
        hAxis: {
            format:'MMMd haa',
            ticks: ticks,
            slantedText : false,
            gridlines: {
                color: 'transparent'
            }
        },
        yAxis: {
            "title": "", // y-axis text
            "gridlines": {
                "count": 5
            }
        } ,
        legend: { position: legendPosition }
    };

    googleChart.formatters = {};
    return googleChart;
}

function plot1HourRange_Lodash(jsonData, chartColor, startdate, totalCols, tickMode, isStacked, chartType, legendPosition) {

    var specFuncs = new Baam.SpecFuncs();
    secondColor = specFuncs.shadeColor('#BB6C5A', 0.3);

    var groupWidth;
    var deviceCount = totalCols;

    if (deviceCount >= window.GoogleCharts.columnChartSettings.LO_DEVICE_COUNT &&
        deviceCount <= window.GoogleCharts.columnChartSettings.HI_DEVICE_COUNT) {
        groupWidth = deviceCount * window.GoogleCharts.columnChartSettings.COLUMN_WIDTH;
    } else {
        groupWidth = window.GoogleCharts.columnChartSettings.DEFAULT_WIDTH;
    }

    var googleChart = {};
    googleChart.type = chartType;
    googleChart.displayed = true;
    googleChart.data = jsonData;

    googleChart.options = {
        "title": "",
        "isStacked": isStacked,
        width: window.GoogleCharts.columnChartSettings.CHART_AREA_WIDTH,
        height: window.GoogleCharts.columnChartSettings.CHART_AREA_HEIGHT,
        bar: { groupWidth: groupWidth },
        colors: isStacked ? [chartColor, secondColor] : [chartColor],
        "displayExactValues": true,
        "vAxis": {
            "title": "",
            "gridlines" : window.GoogleCharts.columnChartSettings.V_AXIS_GRIDLINES
        },
        "hAxis": {
            "title": deviceCount > 1 ? 'Devices 1-' + deviceCount : 'Device 1',
           ticks : []
        },
        legend: { position: legendPosition }
    };

    return googleChart;
}

function plotDateRange_Lodash(jsonData, chartColor, startdate, totalCols, tickMode, isStacked, chartType, legendPosition, isCustom) {

    var specFuncs = new Baam.SpecFuncs();
    secondColor = specFuncs.shadeColor('#BB6C5A', 0.3);

    var groupWidth;

    switch (tickMode) {
        case 'weeks' :
            groupWidth = window.GoogleCharts.columnChartSettings.COLUMN_WIDTH;
            ticks = [];
            for (var i = 0; i < 7; i++) {
                if (i != 7) {
                    ticks.push(moment(startdate).add(i, 'days').toDate());
                } else {
                    ticks.push( { v: moment(startdate).add(i, 'days').toDate(), f : '' } );
                }
            }
            hAxisTitle = '';
            break;
        case 'days' :
            excludedDaysOnHAsix = [2,3,4,5,7,8,9,10,11,13,14,15,16,17,19,20,21,22,23,25,26,27,28,29,31];
            numDatesWithValues = jsonData.rows.length;
            totalCols = totalCols + 1 ;
            if (totalCols <= 10) {
                groupWidth = window.GoogleCharts.columnChartSettings.COLUMN_WIDTH;
            } else {
                if (numDatesWithValues <= 5) {
                    if (numDatesWithValues == 1) {
                        groupWidth = window.GoogleCharts.columnChartSettings.COLUMN_WIDTH;
                    } else {
                        groupWidth = (numDatesWithValues * 12).toString() + "%";
                    }
                } else if (numDatesWithValues <= 10) {
                    groupWidth = window.GoogleCharts.columnChartSettings.COLUMN_WIDTH - 5;
                } else {
                    if (totalCols - numDatesWithValues > 5) {
                        groupWidth = (numDatesWithValues / totalCols) * window.GoogleCharts.columnChartSettings.COLUMN_WIDTH;
                    } else {
                        groupWidth = window.GoogleCharts.columnChartSettings.DEFAULT_WIDTH;
                    }
                }
            }
            ticks = [];
            if (totalCols > 0 && totalCols <= 10) {
                for (i = 0; i < totalCols; i++) {
                    ticks.push(moment(startdate).add(i, 'days').toDate());
                }
            } else if (totalCols > 10) {
                var spread = (totalCols / 4)
                ticks.push(moment(startdate).toDate());
                ticks.push(moment(startdate).add(Math.ceil(1 * spread) - 1, 'days').toDate());
                ticks.push(moment(startdate).add(Math.ceil(3 * spread) - 1, 'days').toDate());
                ticks.push(moment(startdate).add(2 * spread, 'days').toDate());
                ticks.push(moment(startdate).add(totalCols - 1, 'days').toDate());
            }
            hAxisTitle = '';
            break;
        case 'hours' :
            excludedHoursOnHAsix = [1,2,3,4,5,7,8,9,10,11];
            includeHours = [0]
            groupWidth = window.GoogleCharts.columnChartSettings.DEFAULT_WIDTH;
            groupWidth = (totalCols/((24/12)*(totalCols/24)))/(totalCols/24);
            ticks = [];

            var spread = (totalCols / 8);

            ticks.push(moment(startdate).toDate());
            ticks.push( { v : moment(startdate).add(1 + Math.ceil(1 * spread) - 1, 'hours').toDate(), f : moment(startdate).add(1 + Math.ceil(1 * spread) - 1, 'hours').format('ha') });
            ticks.push( { v : moment(startdate).add(1 + Math.ceil(2 * spread) - 1, 'hours').toDate(), f : moment(startdate).add(1 + Math.ceil(2 * spread) - 1, 'hours').format('ha') });
            ticks.push( { v : moment(startdate).add(1 + Math.ceil(3 * spread) - 1, 'hours').toDate(), f : moment(startdate).add(1 + Math.ceil(3 * spread) - 1, 'hours').format('ha') });
            ticks.push(moment(startdate).add((4 * spread), 'hours').toDate());
            ticks.push( { v : moment(startdate).add(1 + Math.ceil(5 * spread) - 1, 'hours').toDate(), f : moment(startdate).add(1 + Math.ceil(5 * spread) - 1, 'hours').format('ha') });
            ticks.push( { v : moment(startdate).add(1 + Math.ceil(6 * spread) - 1, 'hours').toDate(), f : moment(startdate).add(1 + Math.ceil(6 * spread) - 1, 'hours').format('ha') });
            ticks.push( { v : moment(startdate).add(1 + Math.ceil(7 * spread) - 1, 'hours').toDate(), f : moment(startdate).add(1 + Math.ceil(7 * spread) - 1, 'hours').format('ha') });
            ticks.push(moment(startdate).add((8 * spread), 'hours').toDate());

            hAxisTitle = '';
            break;
        case 'singlehour' :
            groupWidth = 25;
            ticks = [];
            hAxisTitle = 'Device 1';
            break;
    }

    var formats = {
        'days'  : 'MMM d',
        'weeks' : 'MMM d yyyy',
        'hours' : 'MMMd haa',
        'singlehour' : ''
    }

    var googleChart = {};
    googleChart.type = chartType;
    googleChart.displayed = true;
    googleChart.data = jsonData;

    googleChart.options = {
        lineWidth : 1,
        interpolateNulls : false,
        "title": "",
        "isStacked": isStacked,
        width: window.GoogleCharts.columnChartSettings.CHART_AREA_WIDTH,
        height: window.GoogleCharts.columnChartSettings.CHART_AREA_HEIGHT,
        pointSize: 4,
        bar: { groupWidth : groupWidth },
//        fontSize : 10,
        colors: [chartColor, secondColor],
        "displayExactValues": true,
        "vAxis": {
            "title": "",
            "minValue": 0,
            "gridlines" : window.GoogleCharts.columnChartSettings.V_AXIS_GRIDLINES
        },
        hAxis: {
            "title": hAxisTitle,
            format: formats[tickMode],
            ticks: ticks,
            slantedText : false,
            minTextSpacing : 1,
//            "gridlines": {
//                "count": 4
//            },
            viewWindowMode : "maximized",
            gridlines: {
                color: 'transparent'
            }
        },
        legend: { position: legendPosition }
    };

    return googleChart;
}

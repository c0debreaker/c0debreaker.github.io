window.GoogleCharts = {

    columnChartSettings : {
        CHART_AREA_WIDTH : 0,     // value of 0 will allow GoogleChart library to dynamically adjust chart area when
        CHART_AREA_HEIGHT : 0,    // browser is resized
        COLUMN_WIDTH : 15,       // 25 pixels but is multiplied by the number of devices
        DEFAULT_WIDTH : '61.8%', // Google Chart's default value from documentation 61.8%
        V_AXIS_GRIDLINES : { "count": 4 },
        LO_DEVICE_COUNT : 1,      // lo and hi to sets the range of how many columns
        HI_DEVICE_COUNT : 11,
        CHART_TYPE : 'ColumnChart' // will have a width of 25 pixels
    },

    // NOT USED, for future
    barChartSettings : {
    },

    areaChartSettings : {
    },

    pieChartSettings : {
    },

    chartProperties : {
        colors: ['#669998', '#f7981d', '#8d68ac', '#6598cb', '#cb4c4c']
    }
};

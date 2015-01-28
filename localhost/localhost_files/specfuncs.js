(function(ns) {

        var SpecFuncs = function () {};

        SpecFuncs.prototype.pad = function (str, max) {
        //    function SpecFuncs.prototype.pad(str, max) {
            str = str.toString();
            return str.length < max ? SpecFuncs.prototype.pad("0" + str, max) : str;
        }

        SpecFuncs.prototype.add1Day = function (y, m, d) {
            var _date = new Date(parseInt(y), parseInt(m)-1, parseInt(d));
            _date.setDate(_date.getDate()+1);
            return  _date.getUTCFullYear() + '-' + SpecFuncs.prototype.pad((_date.getMonth()+1),2) + '-' + SpecFuncs.prototype.pad(_date.getDate(),2)
        }

        SpecFuncs.prototype.getDaysInMonth = function (m, y) {
            if (m < 1 || m > 12 || typeof y == 'string' || typeof m == 'string') return -1;
            return /8|3|5|10/.test(--m)?30:m==1?(!(y%4)&&y%100)||!(y%400)?29:28:31;
        }

        SpecFuncs.prototype.getWeeksInMonth = function(year, month_number) {

            // month_number is in the range 1..12

            var firstOfMonth = new Date(year, month_number - 1, 1);
            var lastOfMonth = new Date(year, month_number, 0);

            var used = firstOfMonth.getDay() + lastOfMonth.getDate();

            return Math.ceil( used / 7);
        }

        SpecFuncs.prototype.generateWeekRange = function (year, month, weekIndex) {

            var dateRangeArray = [];
            for (var day = 1; day <= SpecFuncs.prototype.getDaysInMonth(month, year); day++) {
                if (day % 7 == 1) {
                    dateRangeArray.push( {
                        startdate: year + '-' + SpecFuncs.prototype.pad(month,2) + '-' + SpecFuncs.prototype.pad(day,2),
                        enddate : year + '-' + SpecFuncs.prototype.pad(month,2) + '-' + SpecFuncs.prototype.pad((day+6 > SpecFuncs.prototype.getDaysInMonth(month, year) ? day+(SpecFuncs.prototype.getDaysInMonth(month, year) - day) : day+6),2)
                    });
                }
            }
            if (weekIndex-1 < dateRangeArray.length) {
                return dateRangeArray[weekIndex-1];
            } else {
                return false;
            }
        }

        SpecFuncs.prototype.calculateTotalandAveragePrinted = function (_tmpDeviceModels, index) {
            var totalPrinted = 0,
                averagePrinted = 0;
            _tmpDeviceModels[index].dates.forEach(function(d) {
                totalPrinted = totalPrinted + parseInt(d.odometerInchesPrinted);
                averagePrinted = Math.round(totalPrinted / _tmpDeviceModels[index].dates.length);
            })
            return { totalPrinted : totalPrinted, avgInches : averagePrinted }
        }

        SpecFuncs.prototype.generateRandomText = function (len, extension)
        {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for( var i=0; i < len; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text + '.' + extension;
        }

        SpecFuncs.prototype.convertDateToUTC = function (dateString) {
            // This function will convert current timezone to UTC
            // dateString input 2014-06-30 02:00:00
            var tmpDateTime = dateString.split(' ');
            var tmpDate = tmpDateTime[0].split('-');
            var tmpTime = tmpDateTime[1].split(':');

            // Input format required : 2014-01-30 11:00 PM or 2014-01-30 23:00
            // Output format : 2014-06-30T02:00:00Z
            var monthNum = '';

            // Output of this code : Wed, 30 Jul 2014 03:54:00 GMT
            // ["Fri,", "31", "Jan", "2014", "05:00:00", "GMT"]
            var tmpDate = new Date(parseInt(tmpDate[0]), parseInt(tmpDate[1])-1, parseInt(tmpDate[2]), parseInt(tmpTime[0]), parseInt(tmpTime[1]), parseInt(tmpTime[2])).toUTCString().split(' ');

            switch (tmpDate[2]) {
                case 'Jan' : monthNum = "01"; break;
                case 'Feb' : monthNum = "02"; break;
                case 'Mar' : monthNum = "03"; break;
                case 'Apr' : monthNum = "04"; break;
                case 'May' : monthNum = "05"; break;
                case 'Jun' : monthNum = "06"; break;
                case 'Jul' : monthNum = "07"; break;
                case 'Aug' : monthNum = "08"; break;
                case 'Sep' : monthNum = "09"; break;
                case 'Oct' : monthNum = "10"; break;
                case 'Nov' : monthNum = "11"; break;
                case 'Dec' : monthNum = "12"; break;
            }

            return tmpDate[3] + '-' + monthNum + '-' + SpecFuncs.prototype.pad(tmpDate[1],2) + 'T' + tmpDate[4] + 'Z';

        }

        SpecFuncs.prototype.generateDatesForWeek = function (startDate, endDate) {

            var startNum = startDate.split('-');
            var endNum = endDate.split('-');

            var tmpArray = [];

            for ( var i = parseInt(startNum[2]); i <= parseInt(endNum[2]); i++ ) {
                tmpArray.push( startNum[0] + '-' +  startNum[1] + '-' + SpecFuncs.prototype.pad(i.toString(),2))
            }
            return tmpArray;
        }

        SpecFuncs.prototype.utf8_to_b64 = function ( str ) {
            return window.btoa(unescape(encodeURIComponent( str )));
        }

        SpecFuncs.prototype.b64_to_utf8 = function ( str ) {
            return decodeURIComponent(escape(window.atob( str )));
        }

        SpecFuncs.prototype.hourCount = function(now, then, mode) {

            var formats = {
                'days'  : 'YYYY-MM-DD',
                'weeks' : 'MMM dd, yyyy',
                'hours' : 'YYYY-MM-DDTHH:mm:SSZ',
                'singlehour' : 'YYYY-MM-DDTHH:mm:SSZ'
            }

            var ms = moment(now, formats[mode]).diff(moment(then, formats[mode]));
            var d = moment.duration(ms);

            switch (mode) {
                case 'hours' : return Math.floor(d.asHours()); break;
                case 'days'  : return Math.floor(d.asDays()); break;
            }

        }

        SpecFuncs.prototype.shadeColor = function(color, percent) {
            var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
            return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
        }

    ns.SpecFuncs = SpecFuncs;

})(Baam);



cockpitApp.factory('CurrentLocaleFactory', function() {

    var _locale = { locale : undefined };
    return _locale;

})

cockpitApp.factory('TimezoneFactory', function() {

    var tz = jstz.determine();
    var _timeZone  = { timeZone : tz.name() };
    return _timeZone;

})
cockpitApp.filter('capitalizeFirst', function() {
    return function(input) {
        if (input != null)
            input = input.toLowerCase();
        return input.substring(0,1).toUpperCase()+input.substring(1);
    }
});

cockpitApp.filter('toEllipsis', function() {
    return function(n, nLen) {
        return n.length > nLen ? n.substr(0, nLen - 1) + '  . . .' : n;
    }
});
function downloadCsvStream(csvStream, csvFileName) {
    
    var octetStreamMime = "application/octet-stream";
    if(navigator.msSaveBlob) {
        var blob = new Blob([csvStream], { type: octetStreamMime });
        navigator.msSaveBlob(blob, csvFileName);
    }
    else
    {
        var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
        if(urlCreator)
        {
            var link = document.createElement("a");
            if("download" in link) {
                var blob = new Blob([csvStream], { type: octetStreamMime });
                var url = urlCreator.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", csvFileName);

                var event = document.createEvent('MouseEvents');
                event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                link.dispatchEvent(event);
            } else {
                var blob = new Blob([csvStream], { type: octetStreamMime });
                var url = urlCreator.createObjectURL(blob);
                window.location = url;
            }
        } else {
            console.log("Not supported");
        }
    }
}

function csvToJson(csv) {

    var lines = csv.split("\n");

    // Let's remove the empty line
    var indexOfEmptyLine = _.findIndex(lines,function(a) { return a.length == 0 });
    lines.splice(indexOfEmptyLine, 1);

    // Let's do some cleanup
    for (i = 0;i < lines.length; i++ ) {
        if (lines[i].length > 0) {
            lines[i] = lines[i].replace(/"/g,'');
        }
    }

    var result = [];

    var headers = lines[0].split(",");

    for(var i = 1; i < lines.length; i++) {

        var obj = {};
        if (lines[i].length > 0) {
            var currentline = lines[i].split(",");

            for(var j = 0; j < headers.length; j++) {
//                obj[headers[j]] = JSON.parse(currentline[j]);
                obj[headers[j]] = currentline[j];
            }

            result.push(obj);
        }
    }

    //return result; //JavaScript object
//    return JSON.stringify(result); //JSON
    return result;
}
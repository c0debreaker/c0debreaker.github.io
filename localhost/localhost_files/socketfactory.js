cockpitApp.factory('SocketDispatcher', ['RedshiftRestangular', '$q', '$rootScope', function(RedshiftRestangular, $q, $rootScope) {
        var deferredLoad = $q.defer();
        var isLoaded = deferredLoad.promise;
        var chartData = { "jsonData" : "" };
//
        isLoaded.then(function(data) {
            chartData.jsonData = data;
            return chartData;
        });
//
//         return {
//            getJsonData : function() {
//                return isLoaded;
//            },
//            initJsonData : function() {
//                RedshiftRestangular.all("totalbytesusage").getList()
//                    .then(function(response) {
//                        deferredLoad.resolve(response);
//                    }, function(res){
//                        deferredLoad.reject({'error' : res });
//                    })
//            }
//        };

    return {
        initSocket : function() {
            // Establish connection to the socket server
            $rootScope.primus = new Primus('http://localhost:7777');

            // Let's listen to incoming data
//            primus.on('data', function received(data) {
//                console.log('socket from factory');
//                console.log(data);
//                deferredLoad.resolve(data);
////                output.value += data +'\n';
////                console.log(data);
// //               return data;
//     //           $rootScope.jsonData = data;
//            });
        },
        getJsonData : function() {
            return isLoaded;
        }
    }


    function dispatchMessage(msg) {
        primus.write(msg);
    }


    }])

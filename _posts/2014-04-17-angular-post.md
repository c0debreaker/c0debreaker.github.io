---
layout: post
title: AngularJS is awesome!!!
description: "My feedback about AngularJS, April 17"
tags: [hacking, frontend development, angularjs]
comments: true
---

I just want to say that AngularJS is elegant! Simply phenomenal!


### The Factory

{% highlight c %}
cockpitApp.factory('DailyCassandraFactory', ['CassandraRestangular', '$q', function(CassandraRestangular, $q) {
    var deferredLoad = $q.defer();
    var isLoaded = deferredLoad.promise;
    var DailyBytes = { "jsonData" : "" };

    isLoaded.then(function(data) {
        DailyBytes.jsonData = data;
        return DailyBytes;
    });

    return {
        getJsonData : function() {
            return isLoaded;
        },
        initJsonData : function() {
            CassandraRestangular.all("daily").getList({udi : ''})
                .then(function(response) {
                    deferredLoad.resolve(response);
                }, function(res){
                    deferredLoad.reject({'error' : res });
                })
        }
    };
}])
{% endhighlight %}


### The Controller

{% highlight c %}
cockpitApp.controller('DailyCassandraController', ['$scope', 'ngTableParams', 'DailyCassandraFactory', '$filter', function($scope, ngTableParams, DailyCassandraFactory, $filter) {

    $scope.dataLoader = DailyCassandraFactory.getJsonData();
    $scope.dataLoader.then(function(data) {
        $scope.tableParams = new ngTableParams({
            page: 1,
            count: 10,
            sorting: {
                name: 'asc'
            }
        }, {
            groupBy: 'user',
            total: data.length,
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
}])
{% endhighlight %}

---
layout: post
title: The Elegance of AngularJS $httpProvider Interceptor, Jul21
description: "Capturing headers and exploiting the power of intercepting http's request and response!!!"
tags: [javascript, angularjs, $httpProvider, interceptor, factories, restangular]
comments: true
---

Two months ago, a new team was built consisting of 2 backend developers and 1 frontend developer( it's me :-) ). We had all the freedom to pick which technology we want to use. Since I was the only frontend developer, I was the only one to disagree with myself, LOL! The purpose of the team was to build a monitoring and analytics tool.
I picked AngularJS, NodeJs, Primus+SockJS and Restangular(there are more). Were asked to build a monitoring tool and to display metric data in chart format. I used Google Charts to display all the metrics that I retrieve from a specific endpoint via Restangular. However, I started first with FusionCharts. It was great but customizing it was a bit of a pain. I also tried HighCharts.
It was nice but I was looking for something more flexible. Just wanted to share what the app is doing.

Fast forward, we were asked to generate a report and convert it to csv format. I wrote some PoC in the frontend that converts the json data into csv format. It works well with small sizes but when json data is about 20mb, it crashes Chrome but not Firefox. I decided and told the team that it's a bad approach if we implement
the conversion in the frontend. The backend java devs, the folks who provides me the json data, wrote a converter to csv format. Oh, forgot to mention that the source of data is Cassandra. However, I am using Restangular to retrieve json data via the API endpoints. Back to csv conversion, the dev folks made 2 endpoints for retrieving the csv report. Yes I know, you're going to ask why 2 endpoints.
Well, I honestly like the reasons why they built it that way. The first REST call is a POST but query string is also used for including startdate and enddate of the report I want. Once the API receives my request, it responds back with 200, "Ok, I will generate your data" with an ephemeral resourceId that I will use for the next REST call. On the second REST request, a GET method, the API responds with either the report via octet-stream or a 404 with a message saying
"Your report with resourceId 2DNA7YSNDEJTFHHPQNP and filename KWRWzcDhjrfcs2GK9G6p.csv is still being generated ". I hear yah! I know you'll "WHAT THE .......!!!!" :). This is actually a very good approach especially when the report being generated is huge. It puts a lot of flexibility to the frontend. However, the coding on the frontend becomes a little more complicated ... maybe! :) You can just keep on calling the second REST endpoint until you
receive the file. This is what I'm actually doing but not via a for or while-loop. I'm exploting the power of Angulars' $httpProvider.interceptors.

### The Nested Restangular Endpoint calls

{% highlight c %}
OdometerRestFactory.one('csvexport').customPOST({}, path, { startdate : startHour, enddate : endHour, format : 'csv' }).then(function(data) {
    OdometerRestFactory.all('csvexport').get('csvreport', {
        format : 'csv',
        reportresourceid : $rootScope.downloadToken
    }).then(function(csvdata) {
            downloadCsvStream(csvdata, $rootScope.csvFilename);
            $rootScope.csvFilename = "";
    }, function(err) {
            $rootScope.modalDialogs.loadingSpinner = false;
            if (err.status == 404 && err.data.message.indexOf('still being generated') == -1) {
                alert('1');
                $scope.unknownError = true;
                $scope.serverError = err.data;
            }
            console.log('Reason for failure:', err);
        })
});
{% endhighlight %}


### $httpProvider Interceptor

{% highlight c %}
cockpitApp.config(['$provide', '$httpProvider', function ($provide, $httpProvider) {

// Intercept http calls.

$provide.factory('BaamHttpInterceptor', ['$q', '$injector', '$rootScope', function($q, $injector, $rootScope) {
    return {
        // On request success
        request: function (config) {
            //  console.log('$httpInterceptor1', config); // Contains the data about the request before it is sent.

            // Return the config or wrap it in a promise if blank.
            return config || $q.when(config);
        },

        // On request failure
        requestError: function (rejection) {
            //  console.log('$httpInterceptor2',rejection); // Contains the data about the error on the request.

            // Return the promise rejection.
            return $q.reject(rejection);
        },

        // On response success
        response: function (response) {
            //    console.log('$httpInterceptor3',response); // Contains the data from the response.

            // Return the response or promise.
            return response || $q.when(response);
        },

        // On response failture
        responseError: function (rejection) {
            $rootScope.downloadStatus = rejection.data.message;
            if (rejection.data.status == 401) {
                var $state = $injector.get('$state');
                var User = $injector.get('User');
                $rootScope.modalDialogs.loadingSpinner = false;
                $rootScope.modalDialogs.tokenExpired = true;
            }
            if (rejection.data.status == 404 && rejection.data.message.indexOf('still being generated') != -1) {
                var OdometerRestFactory = $injector.get('OdometerRestFactory');
                OdometerRestFactory.all('csvexport').get('csvreport', {
                    format : 'csv',
                    reportresourceid : $rootScope.downloadToken
                }).then(function(csvdata) {
                        downloadCsvStream(csvdata, $rootScope.csvFilename);
                        $rootScope.csvFilename = "";
                    }, function(errorResponse){
                        console.log('Reason for failure in Factory:', errorResponse.data.message);
                    })
            }
            // Return the promise rejection.
            return $q.reject(rejection);
        }
    };
}]);

// Add the interceptor to the $httpProvider.
$httpProvider.interceptors.push('BaamHttpInterceptor');

}]);
{% endhighlight %}

Have a great day everyone! Peace!
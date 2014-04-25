---
layout: post
title: AngularJS is crazy!!! Apr17
description: "My feedback about AngularJS"
tags: [hacking, frontend development, angularjs]
comments: true
---

I just want to say that AngularJS is elegant! Simply phenomenal!

{% highlight c %}
angular.module('project1App')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  })
  .controller('TenantWorldCtrl', function($scope, $http) {

    $scope.loadSummary = function() {
        $scope.tenantSummary = [];
        $http.get('http://api.somedomain.io/api/v1')
            .then(function(res) {
                $scope.tenantSummary = res.data;
            });
    };
    $scope.loadTenant = function(id) {
        $scope.tenant = [];
        $http.get('http://api.somedomain.io/api/v1/'+id)
            .then(function(res) {
                $scope.tenant = res.data;
            });
    };
});
{% endhighlight %}

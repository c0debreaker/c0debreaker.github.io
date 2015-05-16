---
layout: post
title: How to intercept and react to HTTP 401 error expired tokens
description: "Capturing headers and exploiting the power of intercepting http's request and response!!! May 16"
tags: [javascript, angularjs, $httpProvider, interceptor, factories, Restangular]
comments: true
---

In the past, I've captured HTTP errors like this. In this example, I was capturing expired tokens and how the code reacted to it. The code inside the error section will invalidate all information related to authentication.

{% highlight c %}
RestFactory.one('reports').getList('days', {})
    .then(function(response) {
        // SUCCESS 
        // add whatever code you like here
    }, function(error) {
        // FAILED
        if ( error.status == 401 ) {
            // I have codes here that will delete cookies, delete localStorage, clean up factory that holds Authentication Object, and so on
        }
    });

{% endhighlight %}

The above code works but the problem with this is that it's inefficient especially when implementing this approach on a huge application. If let's say you have 20 Rest calls like the one above and you needed to edit how the application needs to react, that would be a huge task. Another problem that might happen is that if you forget to edit few files.

The better way or should I say, the recommended way of invalidating authentication information such as stored tokens, ids, etc is via AngularJS' HTTPInterceptor.

First, we'll make a factory or service that will house the code for capturing successes and errros. Secondly, we'll inject this factory into $httpProvider inside .config. Some AngularJS developers will stop here but I usually add a listener inside .run for changing state, and in this case, changing to login state.

### The HTTP Interceptor
{% highlight c %}
'use strict';

angular.module('myApp')
  .factory('APIInterceptor', function($q, $injector) {

    var APIInterceptor = {
          // On request success
          request: function(config) {
            //Return the config or wrap it in a promise if blank.
            return config || $q.when(config);
          },

          // On request failure
          requestError: function(rejection) {
            //  console.log('$httpInterceptor2',rejection); // Contains the data about the error on the request.

            // Return the promise rejection.
            return $q.reject(rejection);
          },

          // On response success
          response: function(response) {
            //    console.log('$httpInterceptor3',response); // Contains the data from the response.

            // Return the response or promise.
            return response || $q.when(response);
          },

          // On response failture
          responseError: function(rejection) {

            // This will capture all HTTP errors such as 401 errors so be careful with your code. You can however
            // examine the "rejection" object so you can add more filtering

            if (rejection.data.status === 401) {
              var Session = $injector.get('Session');
              Session.destroy('Your token has expired!'); // See Session factory below
            }

            // Return the promise rejection.
            return $q.reject(rejection);
          }
        };
        return APIInterceptor;
  });
{% endhighlight %}

### Injecting our HTTP inteceptor to .config
{% highlight c %}

angular.module('myApp')
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

    $httpProvider.interceptors.push('APIInterceptor');
    });

    // Code for UI-Router have been removed for brevity

{% endhighlight %}


### The Session Factory
{% highlight c %}
angular.module('myApp')
  .factory('Session', function($rootScope, cookieStore, COOKIE_DOMAINS) {

    var SessionAPI = {

      get: function (key) {
        return cookieStore.get(key);
      },
      remove: function(key) {
        cookieStore.remove(key, { path : '/', domain : COOKIE_DOMAINS });
      },

    // other methods have been removed for brevity

      destroy: function (message) {
        user = {};
        this.remove('id');
        this.remove('token');
        this.remove('expiresAt');
        this.remove('role');
        this.remove('authType');
        $rootScope.$emit('session:destroy', { message: message });
      }
    };
    return SessionAPI;
  })
{% endhighlight %}


### The Listener on .run
{% highlight c %}
angular.module('myApp')
    .run(function($rootScope, $state, $stateParams, Session) {

        $rootScope.$on('session:destroy', function (event, args) {
          $state.go('login', { message: args.message });
        });

        // other listeners like $stateChangeStart have been removed for brevity
    }
{% endhighlight %}

There you go! So what did we accomplish here? We now have a central way of invalidating a user's token in the frontend and sending him back to the login screen via $state.go('login'). We don't have to rewrite codes that will invalidate tokens. Once this is implemented, you can forget about it and concentrate on other parts of the applications.

I know^3, user tokens are invalidated in the backend. However, we still need to invalidate it in the frontend so we can be given a new token.

Another approach that can you implement is by adding a code that will re-authenticate you in so you can receive a new token rather than redirecting the user back to the login page. However, this is now part of UX (User Experience). So whichever approach, tell your product owner, "I can do it! " :)

Hope you learned something from it.

PEACE!


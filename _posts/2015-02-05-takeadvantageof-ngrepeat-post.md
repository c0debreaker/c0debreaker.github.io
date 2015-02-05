---
layout: post
title: Take advantage of ngRepeat
description: "Refactoring hardcoded values in your templates!!! Feb 5"
tags: [javascript, angularjs, ngRepeat, factories]
comments: true
---

I thought I published this topic last year but I didn't. Should have posted back in July 2014. LOL! Anyways, you just can't stop when a programming language like AngularJS makes your coding an extremely enjoyable experience! I really love AngularJS! It's so friggin powerful!

I needed to add a language selector on the app I'm developing so users can switch to the locale/language they prefer. AngularJS comes with $locale files and you'll have to reference to each file to load it. I'm using lgalfasos' [Angular Dynamic Locale](https://github.com/lgalfaso/angular-dynamic-locale) to dynamically change locales. Here is something I wrote quick. You can also use "track by" and update the model by making it a collection (yourModel.yourProperty[yourEachItemKeyFromNGRepeat]).

### Mostly html, non-dynamic
{% highlight js %}
    <div class="sidebarLocale" ng-class="{ 'slide-out' : boolChangeClass }">
        <div id="languages" style="display: block;">
            <h1>LANGUAGES</h1>
            <ul>
                <li ng-click="selectLocale('de')" ng-class="{ highLightLocale: 'de' == user.locale }"><a href=""><span>DE</span>Deutsch</a></li>
                <li ng-click="selectLocale('en')" ng-class="{ highLightLocale: 'en' == user.locale }"><a href=""><span>EN</span>English</a></li>
                <li ng-click="selectLocale('no')" ng-class="{ highLightLocale: 'no' == user.locale }"><a href=""><span>NO</span>Nynorsk</a></li>
                <li ng-click="selectLocale('es')" ng-class="{ highLightLocale: 'es' == user.locale }"><a href=""><span>ES</span>Español</a></li>
                <li ng-click="selectLocale('fr')" ng-class="{ highLightLocale: 'fr' == user.locale }"><a href=""><span>FR</span>Français</a></li>
                <li ng-click="selectLocale('it')" ng-class="{ highLightLocale: 'it' == user.locale }"><a href=""><span>IT</span>Italiano</a></li>
                <li ng-click="selectLocale('nl')" ng-class="{ highLightLocale: 'nl' == user.locale }"><a href=""><span>NL</span>Nederlands</a></li>
            </ul>
            <ul>
                <li ng-click="selectLocale('pl')" ng-class="{ highLightLocale: 'pl' == user.locale }"><a href=""><span>PL</span>Polski</a></li>
                <li ng-click="selectLocale('pt')" ng-class="{ highLightLocale: 'pt' == user.locale }"><a href=""><span>PT</span>Português</a></li>
                <li ng-click="selectLocale('br')" ng-class="{ highLightLocale: 'br' == user.locale }"><a href=""><span>BR</span>Português</a></li>
                <li ng-click="selectLocale('fi')" ng-class="{ highLightLocale: 'fi' == user.locale }"><a href=""><span>FI</span>Suomi</a></li>
                <li ng-click="selectLocale('tr')" ng-class="{ highLightLocale: 'tr' == user.locale }"><a href=""><span>TR</span>Türkçe</a></li>
                <li ng-click="selectLocale('ru')" ng-class="{ highLightLocale: 'ru' == user.locale }"><a href=""><span>RU</span>Русский</a></li>
                <li ng-click="selectLocale('cn')" ng-class="{ highLightLocale: 'cn' == user.locale }"><a href=""><span>CN</span>简体中文</a></li>
            </ul>
        </div>
    </div>
{% endhighlight %}


This afternoon, I decided to refactor it since it was an eyesore. Here is the new code.

# Refactored code, uses ng-repeat and ng-switch
{% highlight js %}
    <div class="sidebarLocale" ng-class="{ 'slide-out' : boolChangeClass }">
        <div id="languages" style="display: block;">
            <h1>LANGUAGES</h1>
            <div ng-repeat="singleCollection in availableLocales">
                <div ng-switch on="singleCollection.col">
                <ul ng-switch-when="1">
                    <li ng-repeat="language in singleCollection.languages" ng-click="selectLocale(language.locale)" ng-class="{ highLightLocale: language.locale == userData.locale }"><a href=""><span>{{language.locale | uppercase}}</span>{{language.language}}</a></li>
                </ul>
                <ul ng-switch-when="2">
                    <li ng-repeat="language in singleCollection.languages" ng-click="selectLocale(language.locale)" ng-class="{ highLightLocale: language.locale == userData.locale }"><a href=""><span>{{language.locale | uppercase}}</span>{{language.language}}</a></li>
                </ul>
                </div>
            </div>
        </div>
    </div>
{% endhighlight %}

### $scope.availableLocales
{% highlight js %}
    $scope.availableLocales = [
        {
            col : 1,
            languages: [
                { locale : 'de', language : 'Deutsch'},
                { locale : 'en', language : 'English'},
                { locale : 'no', language : 'Nynorsk'},
                { locale : 'es', language : 'Español'},
                { locale : 'fr', language : 'Français'},
                { locale : 'it', language : 'Italiano'},
                { locale : 'nl', language : 'Nederlands'}
            ]
        },
        {
            col : 2,
            languages: [
                { locale : 'ja', language : 'Japanese'},
                { locale : 'gb', language : 'Britain'},
                { locale : 'br', language : 'Português'},
                { locale : 'ar', language : 'Arabic'},
                { locale : 'tr', language : 'Türkçe'},
                { locale : 'ru', language : 'Русский'},
                { locale : 'zh', language : '简体中文'}
            ]
        }
    ];
{% endhighlight %}

### In case you're interested in what selectLocale does
{% highlight js %}
$scope.selectLocale = function(locale) {
    // Pull profile via User factory
    $scope.user = User.getUserData();

    // Assign a new locale to the User's profile. FYI, this function uses $cookieStore
    User.storeSelectedLocale(locale);

    // Being watched by by $watch
    $rootScope.model.selectedLocale = locale;

    // for display such as highlighting, etc
    $scope.model.selectedItem = locale;
    $scope.selectionClass = "";
}
{% endhighlight %}


### Language selector screenshot
<figure>
    <a href="/images/lang.png"><img src="/images/lang.png"></a>
</figure>



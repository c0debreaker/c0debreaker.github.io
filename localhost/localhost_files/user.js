'use strict';

cockpitApp.service('User', ['$http', '$state', '$cookieStore', '$rootScope', 'ZatarTokenService', 'CurrentLocaleFactory', '$q', function User($http, $state, $cookieStore, $rootScope, ZatarTokenService, CurrentLocaleFactory,$q) {

        function NoAuthenticationException(message) {
            this.name = 'AuthenticationRequired';
            this.message = message;
        }

        function NextStateUndefinedException(message) {
            this.name = 'NextStateUndefined';
            this.message = message;
        }

        function AuthenticationExpiredException(message) {
            this.name = 'AuthenticationExpired';
            this.message = message;
        }

        function AuthenticationRetrievalException(message) {
            this.name = 'AuthenticationRetrieval';
            this.message = message;
        }

        $rootScope.userData = {
            isAuthenticated : false,
            username : '',
            resourceId : '',
            bearerToken : '',
            tokenResourceId : '',
            firstname : '',
            lastname : '',
            gravatarLink : '',
            expirationDate : null,
            locale : '',
            ownerHref : ''
        };

        var nextState = {
            name: '',
            error: ''
        };

        function isAuthenticationExpired(expirationDate) {
            var now = new Date();
            expirationDate = new Date(expirationDate);
            if (expirationDate - now > 0) {
                return false;
            } else {
                return true;
            }
        }

        function saveData() {
            removeData();
            $cookieStore.put('auth_data', $rootScope.userData);
        }

        function removeData() {
            $cookieStore.remove('auth_data');
            $cookieStore.remove('fullname');
            $cookieStore.remove('ext_credentials');
            window.localStorage.removeItem('avatarIdCollection');
            window.localStorage.removeItem('queryStringParams');
            $rootScope.activeDate = undefined;

        }

        this.storeSelectedLocaleExt = function(lang) {
            $rootScope.locale = lang;
            $cookieStore.put('locale', $rootScope.locale);

            $rootScope.userData.locale = lang;
            $cookieStore.put('auth_data', $rootScope.userData);
        }

        function storeSelectedLocale(lang) {
            $rootScope.locale = lang;
            $cookieStore.put('locale', $rootScope.locale);

            $rootScope.userData.locale = lang;
            $cookieStore.put('auth_data', $rootScope.userData);
        }

        function retrieveLocale() {
            var currentLocaleSettings = $cookieStore.get('locale');
            if ( typeof currentLocaleSettings === 'undefined' ) {
                // let's default to English
                storeSelectedLocale('en');
                return 'en';
            } else {
//                $rootScope.localeSettings.language = currentLocaleSettings;
                storeSelectedLocale(currentLocaleSettings);
                return currentLocaleSettings;
            }
        }

        function retrieveSavedData() {

            // Retrieving third party credentials
            var ext_credentials = $cookieStore.get('ext_credentials');
            if ( ext_credentials !== undefined ) {
                $rootScope.userData = ext_credentials;
                $rootScope.bearerToken = $rootScope.userData.bearerToken;
            }

            else {
                var savedData = $cookieStore.get('auth_data');

                if (typeof savedData === 'undefined') {
                    throw new AuthenticationRetrievalException('No authentication data exists');
                } else if (isAuthenticationExpired(savedData.expirationDate)) {
                    //throw new AuthenticationExpiredException('Authentication token has already expired');
                } else {
                    $rootScope.userData = savedData;
                    $rootScope.bearerToken = $rootScope.userData.bearerToken;
                }
            }
        }

        function clearUserData() {

            $rootScope.userData.isAuthenticated = false;
            $rootScope.userData.username = '';
            $rootScope.userData.resourceId = '';
            $rootScope.userData.bearerToken = '';
            $rootScope.userData.tokenResourceId = '';
            $rootScope.userData.expirationDate = null;
            $rootScope.bearerToken = undefined;
            $rootScope.locale = '';
        }

        function setHttpAuthHeader() {
          //  $http.defaults.headers.common.Authorization = 'Bearer ' + userData.bearerToken;
        }

        this.isAuthenticated = function() {
            // Retrieving third party credentials
            var ext_credentials = $cookieStore.get('ext_credentials');
            if ( ext_credentials !== undefined ) {
                $rootScope.userData = ext_credentials;
                $rootScope.bearerToken = $rootScope.userData.bearerToken;
                return true;
            }

            else {

                var savedData = $cookieStore.get('auth_data');
                if (typeof(savedData) === 'undefined') {
                    this.removeAuthentication();
                    $state.go('main', {}, {reload: true});
                    return false;
                } else {
                    if ($rootScope.userData.isAuthenticated && !isAuthenticationExpired($rootScope.userData.expirationDate)) {
                        return true;
                    } else {
                        try {
                            retrieveSavedData();
                        } catch (e) {
                            throw new NoAuthenticationException('Authentication not found');
                        }
                        return true;
                    }
                }
                }
        };

        this.getNextState = function() {
            if (nextState.name === '') {
                throw new NextStateUndefinedException('No state data was set');
            } else {
                return nextState;
            }
        };

        this.setNextState = function(name, error) {
            nextState.name = name;
            nextState.error = error;
        };

        this.clearNextState = function() {
            nextState.name = '';
            nextState.error = '';
        };

        this.getUserData = function() {
            return $rootScope.userData;
        };

        this.removeAuthentication = function() {
            removeData();
            clearUserData();
            //    $http.defaults.headers.common.Authorization = null;
        };

        this.authenticate = function(username, password, successCallback, errorCallback, persistData) {

            this.removeAuthentication();
            ZatarTokenService.setResponseInterceptor(function (data, operation, what, url, response) {
                if (operation == 'post') {
                    $rootScope.locationResourceId = response.headers('Location').split('/')[response.headers('Location').split('/').length-1]
                }
                return response.data;
            });
//            ZatarTokenService.all('authentokens').post({ 'email' :  username , 'password' : password })
            ZatarTokenService.one('authentokens').customPOST({'email' :  username , 'password' : password}, '', {app : 'baam'})
                .then(function(data) {
                    var userresourceId = data.href.split('/')[data.href.split('/').length-1]

                    $rootScope.userData = {
                        isAuthenticated : true,
                        username : username,
                        bearerToken : data.token,
                        expirationDate : new Date(data['expires']),
                        resourceId : userresourceId,
                        tokenResourceId : $rootScope.locationResourceId
                    };

                    ZatarTokenService.one('users').customGET($rootScope.userData.resourceId, { 'token' : $rootScope.userData.bearerToken }).then(function(jsondata) {
                        $rootScope.userData.locale = retrieveLocale();

                        // Set locale via Factory
                        var currentLocale = CurrentLocaleFactory;
                        currentLocale.locale = $rootScope.userData.locale;

                        $rootScope.userData.firstname = (jsondata.firstname == null) || (jsondata.firstname == null) ? '' : jsondata.firstname;
                        $rootScope.userData.lastname = (jsondata.lastname == null) || (jsondata.lastname == null) ? '' : jsondata.lastname;
                        var avatar = username.split('@')[0].toLowerCase();
                        $http.get('assets/json/avatar.json')
                        .then(function(res) {

                            $rootScope.userData.gravatarLink = res.data.gravatarLink;
                            if (persistData === true) {
                                saveData();
                            }
                            if (typeof successCallback === 'function') {
                                successCallback();
                            }
                        }, function() {
                            $rootScope.userData.gravatarLink = "assets/img/noface.png";
                            if (persistData === true) {
                                saveData();
                            }
                            if (typeof successCallback === 'function') {
                                successCallback();
                            }
                        })

                    })
                }, function(data) {
                    if (typeof errorCallback === 'function') {
                        if (data.error_description) {
                            errorCallback(data.error_description);
                        } else {
                            errorCallback(data.data.message);
                        }
                    }
                })
        };
    }]);

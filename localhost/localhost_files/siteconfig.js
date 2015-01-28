'use strict';

angular.module('services.config', [])
  .constant('BaamApiEndpoints', {
    DataService : 'https://integration-baam.zatar.com/v1',
    TokenService : 'https://baam-api.zatar.com/'
  });

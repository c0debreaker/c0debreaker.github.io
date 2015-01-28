cockpitApp.factory('AvatarIDCollectionFactory', ['$q', function($q) {

    var deferredLoad = $q.defer();
    var isLoaded = deferredLoad.promise;


    var _avatarCollection = { avatarIds : undefined };

    isLoaded.then(function(data) {
        _avatarCollection.avatarIds = data;
        return _avatarCollection;
    });

    return {
        getAvatarIDCollection : function() {
            return isLoaded;
        },
        initAvatarIDCollection : function(avatarCollection) {
            deferredLoad.resolve(avatarCollection);
        }
    }
}])

cockpitApp.factory('AvatarCollectionFactory', ['User', 'AvatarIDFactory', 'PrinterModels', function(User, AvatarIDFactory, PrinterModels) {

    function getDevices(avatarIdsEndpoint) {
        var userData = User.getUserData();
        AvatarIDFactory.setBaseUrl(avatarIdsEndpoint);
        AvatarIDFactory.setDefaultRequestParams({ userresourceid : userData.resourceId, tokenresourceid : userData.tokenResourceId, token: userData.bearerToken });
        return AvatarIDFactory.one('avatars').customGET('', { 'token' : userData.bearerToken })
            .then(function(avatarIdCollection) {
                return _.chain(avatarIdCollection)
                    .filter(function(data) {
//                        var modelPropertyKey = _.property(data.sysPrefix.toUpperCase());
//                        return _.find(PrinterModels, modelPropertyKey) != undefined;
                        return data.attributes[data.sysPrefix+'.stat.prop.type'] == 'Printer';
                    })
                    .map(function(item) {
                        return {
                            sysPrefix : item.sysPrefix,
                            avatarId : item.href.split('/')[7],
                            name : item.attributes[item.sysPrefix + '.dyn.prop.name'] != undefined ? item.attributes[item.sysPrefix + '.dyn.prop.name'] : "", // item.attributes[item.sysPrefix + '.dyn.prop.name'].toUpperCase(),
                            serialNumber : item.attributes[item.sysPrefix + '.stat.prop.serial.number'],
                            location : item.attributes[item.sysPrefix + '.dyn.prop.location'] != undefined ? item.attributes[item.sysPrefix + '.dyn.prop.location'] : "",
                            type : item.attributes[item.sysPrefix + '.stat.prop.type']
                        }
                    })
                    .value();

            })
    }

    return {
        getDeviceIdListing : function(avatarIdsEndpoint) {
            return getDevices(avatarIdsEndpoint)
                .then(function(data) {
                    return { deviceIds : data };
                });
        }
    }
}])

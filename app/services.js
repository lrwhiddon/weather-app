services = angular.module('weatherApp.services', []);

services.factory('backend', ['$http', '$sce', '$httpParamSerializer', function($http, $sce, $httpParamSerializer) {
    var backend = {};

    backend.jsonp = function(url, successCallback, errorCallback){
        url = $sce.trustAsResourceUrl(url);

        $http({method: 'jsonp', url: url}).
            then(function(response) {
                successCallback(response);
            }, function(response) {
                errorCallback(response);
            });
    };

    backend.buildUrl = function(baseUrl, params){
        return baseUrl + '?' + $httpParamSerializer(params);
    };

    return backend;
}]);

var controllers =  angular.module('weatherApp.controllers', []);

controllers.controller('mainController', ['$scope', 'backend', function($scope, backend) {

    $scope.error = false;
    $scope.loading = true;
    $scope.showAll = false;
    $scope.dailyForecast = null;

    $scope.parseData = function(resp){
        // success callback
        $scope.error = false;
        $scope.loading = false;
        // only take 5 days
        $scope.allDays = resp.data.daily.data;
        // store all days for 'show more' toggle
        $scope.dailyForecast = resp.data.daily.data.slice(0, 5);
    };

    $scope.showMore = function(){
        // we have all the data already, might as well have an option to show it
        $scope.dailyForecast = $scope.allDays;
        $scope.showAll = true;
    };

    $scope.displayError = function(resp){
        // failure callback
        $scope.loading = false;
        $scope.error = true;
        // the error text coming back from the endpoint is not particularly helpful
        // no reason to store it and pass it through for display
    };

    $scope.init = function(){
        params = {
            exclude: 'minutely,hourly,flags'
        };
        baseUrl = 'https://api.darksky.net/forecast/7a8bd7b32d636822a375c6057336f0ee/47.6027296,-122.3355817';
        url = backend.buildUrl(baseUrl, params);
        backend.jsonp(url, $scope.parseData, $scope.displayError);
    };

    $scope.init();
}]);
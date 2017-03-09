describe('Controller', function() {

    var scope = null;
    var backend = null;
    var initController = null;
    var $httpBackend = null;
    var $rootScope = null;
    var $controller = null;

    beforeEach(function(){
        angular.mock.module('weatherApp.controllers');
        angular.mock.module('weatherApp.services');
    });


    beforeEach(inject(function(_backend_, _$httpBackend_, _$rootScope_, _$controller_){
        backend = _backend_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        scope = _$rootScope_.$new();

        initController = function(){
            return $controller('mainController', {
                '$scope': scope
            });
        };
    }));

    afterEach(function(){
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    
    it('test intial loading and error values', function() {
        initController();
        expect(scope.loading).toBe(true);
        expect(scope.error).toBe(false);
        expect(scope.showAll).toBe(false);
    });

    it('test error callback sets correct loading and error values', function(){
        initController();
        scope.displayError({});
        expect(scope.loading).toBe(false);
        expect(scope.error).toBe(true);
        expect(scope.showAll).toBe(false);
    });

    it('test success callback only takes 5 days worth of data', function(){
        var sampleData = {
            data: {
                daily: {
                    data: []
                }
            }
        };
        for(var i=0; i < 7; i++){
            sampleData.data.daily.data.push({'sample': 'data'});
        }
        initController();
        scope.parseData(sampleData);
        expect(scope.loading).toBe(false);
        expect(scope.error).toBe(false);
        expect(scope.allDays).toBe(sampleData.data.daily.data);
        expect(scope.dailyForecast.length).toBe(5);
        expect(scope.showAll).toBe(false);
    });

    it('test showMore updates dailyForecast and showAll', function(){
        scope.allDays = 'all days';
        scope.dailyForecast = '5 days';
        initController();
        scope.showMore();
        expect(scope.allDays).toBe(scope.dailyForecast);
        expect(scope.showAll).toBe(true);
    });

});

describe('Service', function(){
    var backend = null;

    beforeEach(angular.mock.module('weatherApp.services'));

    beforeEach(inject(function(_backend_){
        backend = _backend_;
    }));

    it('backend should be defined', function() {
        expect(backend).toBeDefined();
    });

    it('jsonp should be defined', function() {
        expect(backend.jsonp).toBeDefined();
    });

    it('buildUrl should be defined', function() {
        expect(backend.buildUrl).toBeDefined();
    });

    it('expect that buildUrl adds querystring parameters', function(){
        url = backend.buildUrl('http://www.test.com', {test1: 'test1', test2: 'test2'});
        expect(url).toBe('http://www.test.com?test1=test1&test2=test2');
    });
});

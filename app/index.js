var angular = require('angular');
var ngModule = angular.module('weatherApp', [
    'weatherApp.controllers',
    'weatherApp.services',
    'weatherApp.directives',
    'weatherApp.filters']);

require('./directives.js');
require('./controllers.js');
require('./services.js');
require('./filters.js');

require('./style.css');
require('bootstrap/dist/css/bootstrap.css');
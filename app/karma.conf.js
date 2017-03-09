// Karma configuration

var webpackConfig = require('../webpack.config.js');
webpackConfig.entry = {};

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
        '../build/vendor.bundle.js',
        '../build/bundle.js',
        '../node_modules/angular-mocks/angular-mocks.js',
        './tests/**/*spec.js',
    ],
    exclude: [
    ],
    webpack: webpackConfig,
    webpackMiddleware: {
        noInfo: true
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS', 'Chrome'],
    singleRun: true,
    concurrency: Infinity
  });
};


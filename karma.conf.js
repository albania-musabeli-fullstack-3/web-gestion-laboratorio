// karma.conf.js
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],

    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage')
    ],

    client: {
      clearContext: false
    },

    reporters: ['progress', 'kjhtml', 'coverage'],

    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      reporters: [
        { type: 'html' },
        { type: 'lcov', file: 'lcov.info' },
        { type: 'text-summary' }
      ]
    },

    browsers: ['Chrome'],

    singleRun: false,
    autoWatch: true
  });
};

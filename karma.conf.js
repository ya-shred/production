var webpack = require('webpack');

var conf = {
    frameworks: ['jasmine'],
    files: [
        'webpack.tests.config.js'
    ],
    preprocessors: {
        'webpack.tests.config.js': ['webpack', 'sourcemap']
    },

    browserify: {
        debug: true,
        transform: [
            ['babelify', {plugins: ['babel-plugin-espower']}]
        ]
    },
    webpack: {
        devtool: 'inline-source-map',
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel',
                    query: {
                        optional: ['runtime'],
                        stage: 0,
                        plugins: 'babel-plugin-rewire'
                    },
                    exclude: /node_modules/
                }
            ]
        }
    },
    webpackServer: {
        noInfo: true
    },
    reporters: ['story'],
    storyReporter: {
        showSkipped: true, // default: false
        showSkippedSummary: true  // default: false
    },
    browsers: [process.env.NODE_ENV === 'continuous' ? 'Firefox' : 'Chrome'],
    singleRun: false
    //singleRun: true
};

if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'continuous') {
    conf.singleRun = true;
}

module.exports = function (config) {
    config.set(conf);
};
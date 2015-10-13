var webpack = require('webpack');

module.exports = function (config) {
    config.set({
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
        reporters: [ 'story' ],
        storyReporter: {
            showSkipped:        true, // default: false
            showSkippedSummary: true  // default: false
        },
        browsers: ['Chrome'],
        singleRun: false
        //singleRun: true
    })
};
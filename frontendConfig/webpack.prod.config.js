var webpack = require('webpack');

var config = require('./webpack.common.config.js');

// https://github.com/webpack/docs/wiki/list-of-plugins#uglifyjsplugin
config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    }
}));

// https://github.com/webpack/docs/wiki/list-of-plugins#noerrorsplugin
config.plugins.push(new webpack.NoErrorsPlugin());

config.output.filename = 'bundle.js';

module.exports = config;
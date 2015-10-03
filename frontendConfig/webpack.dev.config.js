var webpack = require('webpack');

var config = require('./webpack.common.config.js');

config.entry.push(
    'webpack-dev-server/client?http://localhost:3000', // WebpackDevServer host and port
    'webpack/hot/only-dev-server'  // "only" prevents reload on syntax errors
);

// https://github.com/webpack/docs/wiki/list-of-plugins#hotmodulereplacementplugin
config.plugins.push(new webpack.HotModuleReplacementPlugin());

config.module.loaders.unshift({
    test: /\.js?$/,
    loaders : [
        'react-hot'
    ],
    exclude: /node_modules/
});

module.exports = config;
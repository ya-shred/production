var webpack = require('webpack');
var config = require('./webpack.config');

// https://github.com/webpack/docs/wiki/list-of-plugins#uglifyjsplugin
config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    }
}));

// https://github.com/webpack/docs/wiki/list-of-plugins#noerrorsplugin
config.plugins.push(new webpack.NoErrorsPlugin());

var compiler = webpack(config);

console.log('start building');
compiler.run(function() {
    console.log('building completed');
    require('./serve.js');
});
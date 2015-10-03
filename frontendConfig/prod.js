var webpack = require('webpack');
var config = require('./webpack.prod.config.js');

var compiler = webpack(config);

console.log('start building');
compiler.run(function() {
    console.log('building completed');
    require('./serve.js');
});
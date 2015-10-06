var webpack = require('webpack');
var config = require('./webpack.config');

webpack(config).watch({ // watch options:
    aggregateTimeout: 300, // wait so long for more changes
    poll: true // use polling instead of native watchers
}, function (err, stats) {
    console.log(stats.hash);
});

require('./serve');

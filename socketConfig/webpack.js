var webpack = require('webpack');
var path = require('path');
var configClient = {
    entry: "./client.js",

    output: {
        filename: "browser.js"
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"production"'
            }
        })
        //new webpack.optimize.UglifyJsPlugin()
    ]
};
var configClientMin = {
    entry: "./client.js",

    output: {
        filename: "browser.min.js"
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"' + process.env.NODE_ENV + '"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin()
    ]
};
var configServer = {
    entry: [
        "./index.js"
    ],

    output: {
        path: path.join(__dirname, 'tmp'),
        filename: "tmp.js"
    }

};

// Компилируем клиентский в браузерный код
var compilerClient = webpack(configClient);

compilerClient.watch({ // watch options:
    aggregateTimeout: 300, // wait so long for more changes
    poll: true // use polling instead of native watchers
}, function (err, stats) {
    console.log(stats.hash);
});

// Компилируем в минифицированный браузерный код
var compilerClientMin = webpack(configClientMin);

compilerClientMin.watch({ // watch options:
    aggregateTimeout: 300, // wait so long for more changes
    poll: true // use polling instead of native watchers
}, function (err, stats) {
    console.log(stats.hash);
});

var child = require('child_process').fork;
// returns a Compiler instance
var compilerServer = webpack(configServer);
var run = null;

var runServer = function () {
    console.log('start');
    run = child('./bin/app.js');
};

compilerServer.watch({ // watch options:
    aggregateTimeout: 300, // wait so long for more changes
    poll: true // use polling instead of native watchers
    // pass a number to set the polling interval
}, function (err, stats) {
    if (run) {
        console.log('RESTART WEBSOCKET');
        run.kill();
    }
    runServer();
});

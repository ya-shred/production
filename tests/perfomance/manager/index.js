var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var config = require('config');
var path = require('path');
var child_process = require('child_process');

server.listen(config.get('frontPort'), function () {
    var port = server.address().port;
    console.log('Example app listening at http://localhost:%s', port);
});

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));

var info = {
    server: false,
    clients: [],
    statistics: []
};

io.on('connection', function (socket) {
    var isRestarting = false;

    socket.emit('all', info);

    socket.on('restart server', function () {
        console.log('send restart server');
        if (!isRestarting) {
            isRestarting = true;
            process.chdir('../server');
            var pc = child_process.spawn(path.join(__dirname, '../server/init.sh'));
            pc.stdout.on('data', function (data) {
                console.log(data.toString());
            });
            pc.stderr.on('data', function (data) {
                console.log(data.toString());
            });
            pc.on('exit', function (code) {
                process.chdir('../manager');
                console.log(code);
                info.server = !!code;
                isRestarting = false;
                socket.emit('server', {status: info.server});
            });
        }
    });
});
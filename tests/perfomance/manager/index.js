var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var config = require('config');
var path = require('path');
var child_process = require('child_process');
var uuid = require('node-uuid');

server.listen(config.get('frontPort'), function () {
    var port = server.address().port;
    console.log('Example app listening at http://localhost:%s', port);
});

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));

var info = {
    server: false,
    clients: [],
    statistics: {}
};

var counter = 0;

io.on('connection', function (socket) {
    console.log('connection');
    var isRestartingServer = false;

    socket.on('server connected', function() {
        console.log('server connected');
        socket.join('server');

        info.server = true;
        isRestartingServer = false;
        io.to('manager').emit('server', {status: info.server});

        socket.on('disconnect', function() {
            info.server = false;
            io.to('manager').emit('server', {status: info.server});
        });
    });

    socket.on('client connected', function() {
        var id = uuid.v1();
        info.statistics[id] = [];
        console.log('client connected');
        socket.join('client');

        var name = 'client_' + info.clients.length;
        info.clients.push(name);
        io.to('manager').emit('client', {clients: info.clients});

        socket.on('client stats', function(data) {
            console.log('got stats');
            info.statistics[id] = info.statistics[id].concat(data.stat);
            io.to('manager').emit('statistics', {stat: info.statistics});
        });

        socket.on('disconnect', function() {
            delete info.statistics[id];
            var ind = info.clients.indexOf(name);
            info.clients.splice(ind, 1);
            io.to('manager').emit('client', {clients: info.clients});
            io.to('manager').emit('statistics', {stat: info.statistics});
        });
    });

    socket.on('manager connected', function() {
        console.log('manager connected');
        socket.join('manager');

        socket.emit('all', info);

        socket.on('restart server', function () {
            console.log('send restart server');
            if (!isRestartingServer) {
                isRestartingServer = true;
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
                    if (code !== 0) {
                        isRestartingServer = false;
                        socket.emit('server', {status: false});
                    }
                });
            }
        });

        socket.on('add client', function () {
            console.log('send add client');
            process.chdir('../client');
            var pc = child_process.spawn(path.join(__dirname, '../client/init.sh'), [++counter]);
            pc.stdout.on('data', function (data) {
                console.log(data.toString());
            });
            pc.stderr.on('data', function (data) {
                console.log(data.toString());
            });
            pc.on('exit', function (code) {
                process.chdir('../manager');
            });
        });
    });
});
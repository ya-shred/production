var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Socket = require('socket.io-client');

io.on('connection', function (socket) {
    socket.on('add_connection', function (data) {
        model.addConnection(data.num)
            .then(function (num) {
                socket.send({type: 'current_connections', num: num});
            })
    });
});

var model = {
    addConnection: function(num) {

    }
};
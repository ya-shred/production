var config = require('config');
var server = require('http').createServer().listen(config.get('frontPort'));
var io = require('../../socket/models/io').server(server);

var userModel = require('../../socket/models/user');
userModel.init();
var userController = require('../..//socket/controllers/user');

var Socket = require('socket.io-client');

//('http://localhost');
//socket.on('connect', function(){});

io.on('connection', function (socket) {
    userController.newUser(socket);
});
var config = require('config');
var io = require('./socket/models/io').server(config.get('frontPort'));
var uuid = require('node-uuid');
var socket = require('socket.io-client')(config.get('managerUrl'));

socket.on('connect', function() {
    console.log('connected');
    socket.emit('server connected');
});

var mongo = require('./socket/models/mongo');
var userModel = require('./socket/models/user');
mongo.init();
userModel.init();
var userController = require('./socket/controllers/user');

io.on('connection', function (socket) {
    var user = {
        id: uuid.v1()
    };
    socket.request.user = user;
    userController.newUser(socket);
    socket.on('disconnect', function() {
        userModel.removeUserById(user);
    });
});
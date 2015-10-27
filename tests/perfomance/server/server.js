var config = require('config');
var server = require('http').createServer().listen(config.get('frontPort'));
var io = require('./socket/models/io').server(server);
var uuid = require('node-uuid');

server.listen(config.get('frontPort'), function () {
    var port = server.address().port;
    console.log('Example app listening at http://localhost:%s', port);
});

var mongo = require('./socket/models/mongo');
var userModel = require('./socket/models/user');
mongo.init();
userModel.init();
var userController = require('./socket/controllers/user');

io.on('connection', function (socket) {
    socket.request.user = {
        id: uuid.v1()
    };
    userController.newUser(socket);
    socket.on('disconnect', function() {
        userModel.removeUserById(user);
    });
});
var io = require('socket.io');

var model = {
    io: null,
    server: function (server) {
        return model.io = io(server);
    },
    getSockets: function () {
        return model.io.sockets.sockets;
    }
};

module.exports = model;
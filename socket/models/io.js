var io = require('socket.io');

var model = {
    io: null,
    server: function (server) {
        return model.io = io(server);
    }
};

module.exports = model;
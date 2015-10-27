var config = require('config');
require('socket.io')(config.get('frontPort'));
var SocketClient = require('socket.io-client');
var manager = SocketClient(config.get('managerUrl'));
var server = SocketClient(config.get('serverUrl'));
var clientId = config.get('number');

var def = {
    timeout: 300,
    numToSend: 3
};

var stats = {};
var newstats = [];

manager.on('connect', function () {
    console.log('manager connected');
    manager.emit('client connected');
});

var isServer = false;

server.on('connect', function () {
    isServer = true;
    console.log('server connected');
});

server.on('disconnect', function () {
    isServer = false;
    console.log('server disconnected');
});

server.on('message', function (data) {
    if (data.type === 'new_message') {
        var id = data.data.message.additional.message;
        stats[id].push(+new Date());
        newstats.push(stats[id]);
        delete stats[id];
        if (newstats.length === def.numToSend) {
            console.log(newstats);
            manager.emit('client stats', {stat: newstats});
            newstats.length = 0;
        }
    } else {
        console.log(data);
    }
});

var messageId = 0;
var runner = function () {
    console.log('try to send message', messageId);
    if (isServer) {
        var id = clientId + '_' + messageId;
        server.send({
            type: 'send_message',
            data: {
                channel: 'general',
                type: 'simple_message',
                additional: {
                    message: id
                }
            }
        });
        stats[id] = [+new Date()];
        messageId++;
    }
    setTimeout(runner, def.timeout);
};
runner();

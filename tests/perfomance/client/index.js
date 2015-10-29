var config = require('config');
require('socket.io')(config.get('frontPort'));
var SocketClient = require('socket.io-client');
var manager = SocketClient(config.get('managerUrl'));
var clientId = config.get('number');

var def = {
    timeout: 300,
    numToSend: 3,
    connections: 1
};

var stats = {};
var newstats = [];

manager.on('connect', function () {
    console.log('manager connected');
    manager.emit('client connected');
});

manager.on('send def', function (data) {
    def = data.def;
    updateConnections();
});

var runnersCount = 0;

var updateConnections = function () {
    while (runnersCount < def.connections) {
        createRunner(++runnersCount);
    }
};

var createRunner = function (id) {
    var server = SocketClient(config.get('serverUrl'));
    var messageId = 0;
    var isFirst = true;

    server.on('message', function (data) {
        if (data.type === 'new_message') {
            isFirst = false;
            var id = data.data.message.additional.message;
            // Если это наше сообщение, то ведем его учет
            if (stats[id]) {
                stats[id].push(+new Date());
                newstats.push(stats[id]);
                delete stats[id];
                if (newstats.length >= def.numToSend * def.connections) {
                    //console.log(newstats);
                    manager.emit('client stats', {stat: newstats});
                    newstats.length = 0;
                }
            }
        } else {
            console.log(data);
        }
    });

    var run = function () {
        if (id <= def.connections) {
            //console.log('try to send message', messageId);
            var message = clientId + '_' + id + '_' + messageId;
            server.send({
                type: 'send_message',
                data: {
                    channel: 'general',
                    type: 'simple_message',
                    additional: {
                        message: message
                    }
                }
            });
            if (!isFirst) {
                stats[message] = [+new Date()];
                messageId++;
            }
            setTimeout(run, def.timeout);
        } else {
            runnersCount--;
        }
    };

    run('first');
};

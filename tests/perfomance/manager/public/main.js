$(function() {
    var socket = io.connect(window.location.origin);

    var ui = {
        $server: $('.server__status'),
        $server_button: $('.server__restart')
    };

    var info = null;

    var updateAll = function () {
        updateServer();
    };

    var updateServer = function () {
        if (info.server) {
            ui.$server.text('ON');
        } else {
            ui.$server.text('OFF');
        }
    };

    socket.on('connect', function () {
        console.log('Соединились с сервером');
    });

    socket.on('all', function (newInfo) {
        console.log('message all', newInfo);
        info = newInfo;
        updateAll();
    });

    socket.on('server', function(data) {
        info.server = data.status;
    });

    ui.$server_button.click(function() {
       socket.emit('restart server');
    });
});
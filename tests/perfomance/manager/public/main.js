$(function() {
    var socket = io.connect(window.location.origin);

    var ui = {
        $server: $('.server__status'),
        $server_button: $('.server__restart'),
        $client_list: $('.client__list'),
        $client_add: $('.client__add'),
        $stat_list: $('.stat__list')
    };

    var info = null;

    var updateAll = function () {
        updateServer();
        updateClient();
        updateStatistics()
    };

    var updateServer = function () {
        if (info.server) {
            ui.$server.text('ON');
        } else {
            ui.$server.text('OFF');
        }
    };

    var updateClient = function () {
        if (info.clients) {
            var text = '';
            info.clients.forEach(function(el) {
                text += el + ' ';
            });
            ui.$client_list.text(text);
        }
    };

    var updateStatistics = function () {
        if (info.statistics) {
            var html = '';
            for(var key in info.statistics) {
                html += key + ':<br />' + JSON.stringify(info.statistics) + '<br />';
            }
            ui.$stat_list.html(html);
        }
    };

    socket.on('connect', function () {
        console.log('Соединились с сервером');
        socket.emit('manager connected');
    });

    socket.on('all', function (newInfo) {
        console.log('message all', newInfo);
        info = newInfo;
        updateAll();
    });

    socket.on('server', function(data) {
        console.log('server update', data);
        info.server = data.status;
        updateServer();
    });

    socket.on('client', function(data) {
        console.log('client update', data);
        info.clients = data.clients;
        updateClient();
    });

    socket.on('statistics', function(data) {
        console.log('statistics update', data);
        info.statistics = data.stat;
        updateStatistics();
    });

    ui.$server_button.click(function() {
       socket.emit('restart server');
    });

    ui.$client_add.click(function() {
       socket.emit('add client');
    });
});
$(function () {
    var socket = io.connect(window.location.origin);

    var ui = {
        $server: $('.server__status'),
        $server_button: $('.server__restart'),
        $client_list: $('.client__list'),
        $client_add: $('.client__add'),
        $plot: $('#flot-placeholder'),
        $timeout: $('.controls__timeout'),
        $number: $('.controls__number'),
        $conn: $('.controls__connections'),
        $client_update: $('.controls__button'),
        $clear: $('.clear-all')
    };

    var info = null;

    var updateAll = function () {
        updateServer();
        updateClient();
        updateStatistics();
        updateClientDefs();
    };

    var updateClientDefs = function () {
        if (info.clientDefs) {
            ui.$timeout.val(info.clientDefs.timeout);
            ui.$number.val(info.clientDefs.numToSend);
            ui.$conn.val(info.clientDefs.connections);
        }
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
            info.clients.forEach(function (el) {
                text += el + ' ';
            });
            ui.$client_list.text(text);
        }
    };

    var colors = [];

    var updateStatistics = function () {
        var counter = 0;
        var dataset = [];
        var min = 10000;
        var max = 0;
        var minTime = +new Date(), maxTime = +new Date();
        if (info.statistics) {
            for (var key in info.statistics) {
                //var userId = key;
                var userStat = info.statistics[key];
                var newUser = [];

                for (var key2 in userStat) {
                    var time = key2;
                    var timeInt = userStat[key2];
                    var avg = timeInt.reduce(function (last, cur) {
                            return last + cur[1] - cur[0];
                        }, 0) / timeInt.length;
                    if (avg) {
                        newUser.push([time, avg]);
                        min = Math.min(avg, min);
                        max = Math.max(avg, max);
                        minTime = Math.min(minTime, time);
                        maxTime = Math.max(maxTime, time);
                    }
                }
                var ind = ++counter;
                if (!colors[ind]) {
                    colors[ind] = '#' + Math.floor(Math.random() * 16777215).toString(16);
                }
                dataset.push({
                    label: ind,
                    data: newUser,
                    color: colors[ind]
                });
            }

            max = Math.min(max, 1000); // Считаем максимальную задержку в 1с, обрезаем остальное
        }

        $.plot(ui.$plot, dataset, {
            series: {
                lines: {
                    show: true,
                    lineWidth: 1.2
                }
            },
            xaxis: {
                mode: "time",
                tickSize: [Math.floor((maxTime - minTime) / 4 / 1000), "second"],
                tickFormatter: function (v, axis) {
                    var date = new Date(v);

                    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

                    return hours + ":" + minutes + ":" + seconds;
                },
                axisLabel: "Time",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 10
            },
            yaxis: {
                min: 0,
                max: max,
                tickFormatter: function (v, axis) {
                    return Math.floor(v * 100) / 100 + 'ms';
                    //if (v % 5 == 0) {
                    //    return v + "ms";
                    //} else {
                    //    return "";
                    //}
                },
                axisLabel: "Delay",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 6
            },
            legend: {
                labelBoxBorderColor: "#fff"
            },

            grid: {
                backgroundColor: "#000000",
                tickColor: "#008040"
            }

        })
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

    socket.on('server', function (data) {
        console.log('server update', data);
        info.server = data.status;
        updateServer();
    });

    socket.on('client', function (data) {
        console.log('client update', data);
        info.clients = data.clients;
        updateClient();
    });

    socket.on('statistics', function (data) {
        console.log('statistics replace', data);
        info.statistics = data.stat;
        updateStatistics();
    });

    socket.on('new statistics', function (data) {
        //console.log('statistics add', data);
        if (!info.statistics[data.id]) {
            info.statistics[data.id] = {};
        }
        info.statistics[data.id][data.date] = data.stat;
        updateStatistics();
    });

    socket.on('clientDefs', function (data) {
        console.log('client params replace', data);
        info.clientDefs = data;
        updateClientDefs();
    });

    ui.$server_button.click(function () {
        socket.emit('restart server');
    });

    ui.$client_add.click(function () {
        socket.emit('add client');
    });

    ui.$client_update.click(function () {
        var newDefs = {
            timeout: ui.$timeout.val() || 300,
            numToSend: ui.$number.val() || 3,
            connections: ui.$conn.val() || 1
        };
        socket.emit('change client defs', newDefs);
    });

    ui.$clear.click(function () {
        socket.emit('clear');
    });
});
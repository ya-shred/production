window.io = require('socket.io-client');
/**
 * Клиентская библиотека для работы с сокет сервером.
 */
var socketServerUrl = window.location.origin;
var socket = null;

/**
 * Модель для формирования сообщений
 */
var api = {
    send_message: function (params) {
        if (!params.channel) {
            return {error: 'Не указан канал отправки'};
        }
        if (!params.message) {
            return {error: 'Пустое сообщение недопустимо'};
        }
        return {
            type: 'send_message',
            data: params.data
        }
    },
    users_list_request: function (params) {
        return params;
    },
    user_info_request: function (params) {
        return params;
    }
};

class Socket {
    constructor(socket) {
        this.socket = socket;
    }

    /**
     * Интерфейс для отправки команд
     */
    send(params) {
        if (params.type && api[params.type]) {
            var message = api[params.type](params);
            if (message.error) {
                return message.error;
            } else {
                this.socket.send(message);
            }
        } else {
            return 'Неизвестная команда';
        }
    }
}

var model = {
    connect: function (onConnectCallback = () => {
    }, onMessageCallback = () => {
    }) {
        if (!socket) {
            socket = io.connect(socketServerUrl);
        }
        var numberOfConnect = 0;
        socket.on('connect', function () {
            numberOfConnect++;
            onConnectCallback(numberOfConnect);
        });
        socket.on('message', onMessageCallback);
        return new Socket(socket);
    }
};
window.socketClient = model;

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
        if (!params.data.channel) {
            return {error: 'Не указан канал отправки'};
        }
        if (!params.data.message) {
            return {error: 'Пустое сообщение недопустимо'};
        }
        if (params.data.message.length > 5000) {
            return {error: 'Слишком длинное сообщение',
                    long: alert('Слишком длинное сообщение. Постарайтесь до 5000 символов.'),
                    longLog: console.log('Слишком длинное сообщение. Постарайтесь до 5000 символов.')
            };
        }
        return {
            type: 'send_message',
            data: params.data
        }
    },
    send_updated_message: function (params) {
        if (!params.data.channel) {
            return {error: 'Не указан канал отправки'};
        }
        if (!params.data.newText) {
            return {error: 'Пустое сообщение недопустимо'};
        }
        if (params.data.newText.length > 5000) {
            return {error: 'Слишком длинное сообщение',
                long: alert('Слишком длинное сообщение. Постарайтесь до 5000 символов.'),
                longLog: console.log('Слишком длинное сообщение. Постарайтесь до 5000 символов.')
            };
        }
        return {
            type: 'send_updated_message',
            data: {
                id: params.data.messageObj._id,
                message: params.data.newText,
                userId: params.data.messageUser.id,
                channel: params.data.channel
            }
        }
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
                return this.socket.send(message);
            }
        } else {
            return this.socket.send(params);
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

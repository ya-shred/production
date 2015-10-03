window.io = require('socket.io-client');
/**
 * Клиентская библиотека для работы с сокет сервером.
 */
var socketServerUrl;

if (process.env.NODE_ENV === 'production') {
    socketServerUrl = 'https://shri-socket.herokuapp.com/';
} else {
    socketServerUrl = 'http://localhost:8010/';
}

var socket = null;

/**
 * Модель для формирования сообщений
 */
var api = {
    authenticate: function (userId) {
        return {
            type: 'authenticate',
            data: {
                userId: userId
            }
        }
    },
    send_message: function (params) {
        if (!params.channel) {
            return {error: 'Не указан канал отправки'};
        }
        if (!params.message) {
            return {error: 'Пустое сообщение недопустимо'};
        }
        return {
            type: 'send_message',
            data: params
        }
    }
};

/**
 * Модель для работы с сокетным сервером
 */
var model = {
    /**
     * Загрузка клиентской библиотеки для работы с socket.io
     * Запуск аутентификации после загрузки
     * @private
     */
    init: function (authId) {
        return model.inited = new Promise(function (resolve, reject) {
            return model._connect(authId)
                .then(function (userInfo) {
                    /**
                     * TEST: Для тестирования. Выводим в консоль всё что приходит
                     */
                    model.listen(function (message) {
                        console.log(message);
                    });
                    resolve(userInfo);
                })
                .catch(function (error) {
                    return reject(error);
                });
        });
    },
    /**
     * Информация о пользователе
     */
    userInfo: null,
    /**
     * Когда библиотека проинициализирована, промис в inited резолвится
     */
    inited: null,
    /**
     * Аутентификация пользователя на сокетном сервере по ключу
     * @private
     */
    _authenticate: function (userId) {
        return new Promise(function (resolve, reject) {
            if (userId) {
                var callback = function (message) {
                    console.log('authenticated', message);
                    socket.removeListener('message', callback);

                    if (message.type !== 'authenticated') {
                        return reject(message.data.message);
                    }
                    model.userInfo = message.data.user;
                    resolve(model.userInfo);
                };

                socket.on('message', callback);
                socket.emit('authenticate', api.authenticate(userId));
            } else {
                reject('Нет авторизационного ключа');
            }
        });
    },
    /**
     * Подключение к сокетному серверу. При каждом подключении отправлять авторизационный ключ
     * @returns {Promise}
     * @private
     */
    _connect: function (authId) {
        socket = io.connect(socketServerUrl);
        return new Promise(function (resolve, reject) {
            socket.on('connect', function () {
                console.log('connected');
                model._authenticate(authId)
                    .then(function (userInfo) {
                        resolve(userInfo);
                    }, function (error) {
                        reject(error);
                    })
            });
        });
    },
    /**
     * Слушаем входящие сообщения от сокетного сервера
     * @param {Function} callback - вызывается на входящее сообщение
     */
    listen: function (callback) {
        if (!model.inited) {
            return 'Модуль не инициализирован';
        }
        socket.on('message', function (message) {
            callback(message);
        });
    },
    /**
     * Интерфейс для отправки команд
     */
    send: function (params) {
        if (!model.inited) {
            return 'Модуль не инициализирован';
        }

        if (params.type && api[params.type]) {
            var message = api[params.type](params);
            if (message.error) {
                return message.error;
            } else {
                socket.send(message);
            }
        } else {
            return 'Неизвестная команда';
        }
    }
};
window.socketClient = model;

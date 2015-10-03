//var redis = require('socket.io-redis');
var config = require('config');
var io = require('socket.io').listen(config.get('socketPort'));
var api = require('../api/api');
var mongo = require('../mongodb/mongodb.js');

//io.adapter(redis({ host: settings.redisHost, port: settings.redisPort}));

console.log('Socket on ' + config.get('socketPort'));

var model = {
    start: function () {
        // Навешиваем обработчик на подключение нового клиента
        io.on('connection', function (socket) {
            console.log('new user');
            model.connect(socket);
        });
    },
    /**
     * Подключаем пользователя
     * @param {Socket} socket - сокет вновь подключенного пользователя
     * @returns {Promise}
     */
    connect: function (socket) {
        // Храним информацию о подключенном пользователе
        var userInfo = null;

        return model.checkUser(socket)
            // Пользователь проверен
            .then(function (user) {
                console.log('user checked');
                userInfo = user;
                if (user.isNew) {
                    model.connectNewUser(user);
                }
                socket.join('general'); // Сейчас подключаем к общему каналу, по которому сейчас идут сообщения
                // Подключаем пользователя к его каналам, информации о пользователях и отправляем ему эти данные
                return Promise.all([model.joinChannel(user, socket), model.joinUserInfo(user, socket), model.joinSelf(user, socket)]);
            })
            .then(function () {
                // Сообщаем всем что пользователь подключился
                model.connected(userInfo);
                // Обработка всех поступающих от пользователя сообщений
                socket.on('message', function (message) {
                    console.log('got message', message);
                    // Процессим сообщение
                    api.processMessage(userInfo, message)
                        // Если обработка сообщения прошла успешна
                        .then(function (response) {
                            console.log('sending', response);
                            // Отправляем необходимые данные в комнату
                            if (response.message) {
                                io.to(response.channel).send(response.message);
                            }
                        })
                        // Если обработка прошла с ошибкой, отправляем сообщение об ошибке
                        .catch(function (errorMessage) {
                            socket.send(errorMessage);
                        });
                });
                socket.on('disconnect', function () {
                    model.disconnected(userInfo);
                    console.log('user disconnected');
                });
            })
            // Если что-то пошло не так, то отключаем пользователя
            .catch(function (error) {
                console.log('error', error);
                socket.send(error);
                socket.disconnect();
                model.disconnected(userInfo);
                console.log(error);
            });
    },
    /**
     * Ждём от пользователя сообщение с токеном для проверки личности
     * @returns {Promise}
     */
    checkUser: function (socket) {
        console.log('checkUser');
        return new Promise(function (resolve, reject) {
            socket.on('authenticate', function (message) {
                console.log('authenticate', message);
                socket.removeAllListeners('authenticate');
                api.processMessage(null, message)
                    .then(function (response) { // Проверка прошла
                        socket.send(response.message);
                        resolve(response.user);
                    })
                    .catch(function (error) { // Проверка не прошла
                        reject(error);
                    });
            });
        });
    },
    /**
     * Подключам пользователя к каналам сообщений
     * @param {User} user
     * @param {Socket} socket
     * @returns {Promise.<T>}
     */
    joinChannel: function (user, socket) {
        return mongo.getChannels(user)
            .then(function (channels) {
                channels.forEach(function (channel) {
                    socket.join('channel_' + channel.channelId);
                });
                console.log('send channelsList');
                socket.send(api.channelsList(channels));
            });
    },
    /**
     * Подключаем пользователя к информации о других пользователях
     * @param user
     * @param socket
     * @returns {Promise.<T>}
     */
    joinUserInfo: function (currentUser, socket) {
        return mongo.getUsers(currentUser)
            .then(function (users) {
                var rooms = Object.keys(io.sockets.adapter.rooms)
                    .map(function (room) {
                        return room.split('self_')[1];
                    })
                    .filter(function (room) {
                        return !!room;
                    });
                users.forEach(function (user) {
                    user.online = rooms.indexOf(user.id) !== -1;
                    socket.join('user_' + user.id);
                });
                console.log('send usersList');
                socket.send(api.usersList(users));
            });

    },
    /**
     * Подключаем пользователя в его личный канал. Сюда передаются сообщения только для конкретного пользователя
     * @param user
     * @param socket
     * @returns {Promise.<T>}
     */
    joinSelf: function (user, socket) {
        socket.join('self_' + user.id);

    },
    /**
     * Сообщаем всем, что пользователь подключился
     * @param {User} user
     */
    connected: function (user) {
        console.log('connected', 'user_' + user.id);
        io.to('user_' + user.id).send(api.connected(user));
    },
    /**
     * Сообщаем всем, что пользователь вышел
     * @param {User} user
     */
    disconnected: function (user) {
        console.log('disconnected', 'user_' + user.id);
        io.to('user_' + user.id).send(api.disconnected(user));
    },
    /**
     * Залогинился новый пользователь, сообщить всем о нём
     * @param user
     */
    connectNewUser: function(user) {
        io.sockets.sockets.forEach(function(item) {
            item.join('user_' + user.id);
        });
        io.to('user_' + user.id).send(api.newUser(user));
    }
};

module.exports = model;

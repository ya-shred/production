var userModel = require('../models/user');
var api = require('./api');
var mongo = require('../models/mongo');
var io = require('../models/io').io;

var model = {
    /**
     * Подключился новый пользователь
     * @param {Socket} socket
     */
    newUser: function (socket) {
        userModel.inited.then(function () {
            var user = socket.request.user;
            if (userModel.isNew(user)) {
                console.log('new user');
                model.connectNewUser(user, socket);
            }
            socket.join('general'); // Сейчас подключаем к общему каналу, по которому сейчас идут сообщения

            // Подключаем пользователя к его каналам, информации о пользователях и отправляем ему эти данные
            return Promise.all([
                model.joinChannel(user, socket),
                model.joinUserInfo(user, socket),
                model.joinSelf(user, socket)
            ])
                .then(function () {
                    // Сообщаем всем что пользователь подключился
                    model.connected(user, socket);
                    // Обработка всех поступающих от пользователя сообщений
                    model.listen(user, socket);
                })
                // Если что-то пошло не так, то отключаем пользователя
                .catch(function (error) {
                    console.log('error', error);
                    socket.send(error);
                    socket.disconnect();
                    model.disconnected(user);
                });
        })
    },
    /**
     * Слушаем входящие сообщение и отвечаем на них
     * @param {User} user
     * @param {Socket} socket
     */
    listen: function (user, socket) {


        socket.on('message', function (message) {

            //console.log('got message!!!', message);

            // Процессим сообщение
            api.processMessage(user, message)

                // Если обработка сообщения прошла успешна
                .then(function (response) {
                    //console.log('sending', response);
                    // Отправляем необходимые данные в комнату
                    if (response.message) {
                        if (response.channel) {
                            io.to(response.channel).send(response.message);
                        } else {
                            socket.send(response.message);
                        }
                    }
                })
                // Если обработка прошла с ошибкой, отправляем сообщение об ошибке
                .catch(function (errorMessage) {
                    socket.send(errorMessage);
                });
        });


        socket.on('disconnect', function () {
            model.disconnected(user);
            console.log('user disconnected');
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
                    socket.join(model.getChannelRoom(channel));
                });
            });
    },
    /**
     * Подключаем пользователя к информации о других пользователях
     * @param {User} currentUser
     * @param {Socket} socket
     * @returns {Promise.<T>}
     */
    joinUserInfo: function (currentUser, socket) {
        return userModel.getUsers(currentUser)
            .then(function (users) {
                users.forEach(function (user) {
                    socket.join(model.getUserRoom(user));
                });
            });

    },
    /**
     * Подключаем пользователя в его личный канал. Сюда передаются сообщения только для конкретного пользователя
     * @param {User} user
     * @param {Socket} socket
     * @returns {Promise.<T>}
     */
    joinSelf: function (user, socket) {
        socket.join(model.getSelfRoom(user));

    },
    /**
     * Сообщаем всем, что пользователь подключился
     * @param {User} user
     * @param {Socket} socket
     */
    connected: function (user, socket) {
        console.log('connected', 'user_' + user.id);
        socket.broadcast.to(model.getUserRoom(user)).send(api.connected(user));
    },
    /**
     * Сообщаем всем, что пользователь вышел
     * @param {User} user
     */
    disconnected: function (user) {
        console.log('disconnected', 'user_' + user.id);
        io.to(model.getUserRoom(user)).send(api.disconnected(user));
    },
    /**
     * Залогинился новый пользователь, сообщить всем о нём
     * @param {User} currentUser
     * @param {Socket} socket
     */
    connectNewUser: function (currentUser, socket) {
        userModel.existedUsers.push(currentUser.id);
        return mongo.getUsers(currentUser) // подключаем только тех пользователей, к которым есть доступ у нового пользователя
            .then(function (users) {
                users = users.map(function (user) {
                    return user.id;
                });
                io.sockets.sockets
                    .filter(function (socket) {
                        return users.indexOf(socket.request.user.id) !== -1;
                    })
                    .forEach(function (socket) {
                        socket.join(model.getUserRoom(currentUser));
                    });
                socket.broadcast.to(model.getUserRoom(currentUser)).send(api.newUser(currentUser));
            });
    },
    /**
     * Название комнаты сообщений только для текущего пользователя
     * @param {User} user
     * @returns {string}
     */
    getSelfRoom: function (user) {
        return 'self_' + user.id;
    },
    /**
     * Название комнаты сообщений о пользователе
     * @param {User} user
     * @returns {string}
     */
    getUserRoom: function (user) {
        return 'user_' + user.id;
    },
    /**
     * Название комнаты для отправки сообщений в определенный канал
     * @param {Channel} channel
     * @returns {string}
     */
    getChannelRoom: function (channel) {
        return 'channel_' + channel.id;
    }

};

module.exports = model;
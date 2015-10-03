var mongo = require('../mongodb/mongodb.js');
var backend = require('../backend/backend.js');
//var socketServer = require('../io/io.js');

var MESSAGE_HANDLERS = {
    authenticate: 'onAuthenticateMessage',
    error: 'onErrorMessage',
    send_message: 'onSendMessage'
};

var model = {
    handlers: {
        onAuthenticateMessage: function (_, message) {
            var userId = message.data.userId;
            return backend
                .checkUser(userId)
                .then(function (user) {
                    return mongo
                        .checkAndAddUser(user)
                        .then(function (isNew) {
                            user.isNew = !!isNew;
                            return user;
                        });
                })
                .then(function (user) {
                    return {
                        user: user,
                        message: {
                            type: 'authenticated',
                            data: {
                                user: user
                            }
                        }
                    }
                })
        },
        onSendMessage: function (user, message) {
            return {
                channel: message.data.channel,
                message: {
                    type: 'new_message',
                    data: {
                        channel: message.data.channel,
                        message: message.data.message,
                        user: user,
                        datetime: +new Date()
                    }
                }
            }
        },
        onErrorMessage: function () {
            return Promise.reject({
                type: 'status',
                data: {
                    status: 'error',
                    message: 'unknown command'
                }
            });
        }
    },
    /**
     * Процессим сообщение от пользователя, делаем все необходимые действия
     * @param {User} user - информация об отправителе
     * @param {Message} message - сообщение отправителя
     */
    processMessage: function (user, message) {
        var messageHandler = model.handlers[MESSAGE_HANDLERS[message.type]];
        if (!messageHandler) {
            return Promise.resolve(model.handlers[MESSAGE_HANDLERS['error']]());
        }

        return Promise.resolve(messageHandler(user, message))
            .catch(function (error) {
                return Promise.reject({
                    type: 'status',
                    data: {
                        status: 'error',
                        message: error
                    }
                });
            }); // чтоб всегда гарантировать Promise на выходе
    },
    /**
     * Сообщение, когда пользователь отключился
     * @param {User} user
     * @returns {Message}
     */
    disconnected: function (user) {
        return {
            type: 'user_disconnected',
            data: {
                userId: user.id
            }
        }
    },
    /**
     * Сообщение, когда пользователь подключился
     * @param {User} user
     * @returns {Message}
     */
    connected: function (user) {
        return {
            type: 'user_connected',
            data: {
                userId: user.id
            }
        }
    },
    /**
     * Отправляем информацию о каналах
     * @param channels
     */
    channelsList: function (channels) {
        return {
            type: 'channels_info',
            data: {
                channels: channels
            }
        }
    },
    /**
     * Отправляем информацию о пользователях
     * @param users
     */
    usersList: function (users) {
        return {
            type: 'users_info',
            data: {
                users: users
            }
        }
    },
    /**
     * оповещает всех о новом пользователе
     * @param users
     */
    newUser: function (user) {
        return {
            type: 'new_user',
            data: {
                user: user
            }
        }
    }
};

module.exports = model;
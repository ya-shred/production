var mongo = require('../services/mongo.js');
var userModel = require('../models/user');

var MESSAGE_HANDLERS = {
    error: 'onErrorMessage',
    send_message: 'onSendMessage',
    users_list_request: 'onUsersList'
};

var model = {
    handlers: {
        onErrorMessage: function () {
            return Promise.reject({
                type: 'status',
                data: {
                    status: 'error',
                    message: 'unknown command'
                }
            });
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
        onUsersList: function (currentUser) {
            return userModel.getUsers(currentUser)
                .then(function (users) {
                    var rooms = userModel.filterSelfRooms();
                    users.forEach(function (user) {
                        user.online = rooms.indexOf(user.id) !== -1;
                    });
                    return {
                        message: {
                            type: 'users_list_response',
                            data: {
                                users: users
                            }
                        }
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
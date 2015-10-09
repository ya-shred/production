var mongo = require('../services/mongo.js');
var userModel = require('../models/user');

var MESSAGE_HANDLERS = {
    error: 'onErrorMessage',
    send_message: 'onSendMessage',
    history_request: 'onGetHistory',
    users_list_request: 'onUsersList',
    user_info_request: 'onUserInfo'
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

        onGetHistory: function () {
            return mongo.getHistory()
                .then(result => {
                    return {
                        message: {
                            type: 'history_response',
                            data: result
                        }
                    };
                });
        },
        onSendMessage: function (user, message) {
            message.data.user = user;
            message.data.datetime = +new Date();
            return mongo.insertMessage(message.data)
                .then(result => {
                    return {
                        channel: message.data.channel,
                        message: {
                            type: 'new_message',
                            data: result
                        }
                    };
                });
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
        },

        onUserInfo: function (currentUser) {
            return {
                message: {
                    type: 'user_info_response',
                    data: {
                        user: currentUser
                    }
                }
            }
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
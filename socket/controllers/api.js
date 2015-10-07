var mongo = require('../services/mongo.js');
var userModel = require('../models/user');

var MESSAGE_HANDLERS = {
    error: 'onErrorMessage',
    send_message: 'onSendMessage',
    history_request: 'onGetHistory',
    send_updated_message: 'onSendUpdatedMessage',
    users_list_request: 'onUsersList',
    user_info_request: 'onUserInfo',
    peer_connect: 'onPeerConnect',
    peers_request: 'onPeersRequest'
};

var model = {
    handlers: {
        onPeersRequest: function (user) {
            return userModel.getUsersPeer(user)
                .then(function (peers) {
                    return {
                        message: {
                            type: 'peers_response',
                            data: {
                                peers: peers
                            }
                        }
                    }
                });
        },
        
        onPeerConnect: function (user, message) {
            user.peerId = message.data.id;
            return {
                message: {
                    type: 'status',
                    data: {
                        status: 'ok',
                        message: 'peer ' + user.peerId + ' assigned to user'
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
        },

        onGetHistory: function () {
            return mongo.getHistory()
                .then(result => {
                    return {
                        message: {
                            type: 'history_response',
                            data: {
                                history: result
                            }
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
                            data: {
                                message: result
                            }
                        }
                    };
                });
        },
        onSendUpdatedMessage: function (user, message) {
            console.log("sndupdmsg");
            return {
                channel: message.data.channel,
                message: {
                    type: 'get_updated_message',
                    data: {
                        id: message.data.id,
                        message: message.data.message
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
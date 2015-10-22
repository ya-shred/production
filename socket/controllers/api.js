var mongo = require('../services/mongo.js');
var userModel = require('../models/user');
var config = require('config');
var stripe = require("stripe")(config.get('stripeKey'));


var MESSAGE_HANDLERS = {
    error: 'onErrorMessage',
    send_message: 'onSendMessage',
    history_request: 'onGetHistory',
    send_updated_message: 'onSendUpdatedMessage',
    users_list_request: 'onUsersList',
    user_info_request: 'onUserInfo',
    peer_connect: 'onPeerConnect',
    peers_request: 'onPeersRequest',
    new_payment: 'onNewPayment',
    save_middle_message: 'onSaveMiddleMessage'
};

var model = {
    handlers: {
        onPeersRequest: function (user, message) {
            return userModel.getUsersPeer(user)
                .then(function (peers) {
                    return {
                        message: {
                            type: 'peers_response',
                            data: {
                                peers: peers,
                                channel: message.data.channel
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
            message.data.datetime = +new Date();
            message.data.userId = user.id;
            message.data.id = user.id + +new Date();
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
            if (user.id === message.data.userId) {
                return mongo.updateMessage(message.data)
                    .then(result => {
                        return {
                            channel: message.data.channel,
                            message: {
                                type: 'get_updated_message',
                                data: {
                                    id: message.data.id,
                                    additional: message.data.additional
                                }
                            }
                        };
                    });
            } else {
                console.log("user wants to edit not his message");
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
        },

        onNewPayment: function (user, message) {
            return new Promise(function (resolve, reject) {
                var token = message.data.token;
                var amount = message.data.amount;
                var num = message.data.num;
                stripe.charges.create({
                    amount: amount * 100, // amount in cents, again
                    currency: "usd",
                    source: token,
                    description: "Оплата хранения файлов SHRED"
                }, function (err, charge) {
                    if (err && err.type === 'StripeCardError') {
                        // The card has been declined
                        return reject('Карта отклонена');
                    }
                    user.messageAvailable += num;
                    return userModel.updateUser(user)
                        .then(function () {
                            resolve({
                                message: {
                                    type: 'user_info_response',
                                    data: {
                                        user: user
                                    }
                                }
                            });
                        });
                });

            });
        },

        onSaveMiddleMessage: function (user, message) {
            return new Promise(function (resolve, reject) {
                if (user.messageAvailable > user.messageUsed) {
                    user.messageUsed++;
                    mongo.insertMessage(message.data)
                        .then(function (newMessage) {
                            return userModel.updateUser(user)
                                .then(function () {
                                    return newMessage
                                });
                        })
                        .then(function (newMessage) {
                            resolve({
                                message: {
                                    type: 'status',
                                    data: {
                                        status: 'ok',
                                        message: 'message ' + newMessage.id + ' updated'
                                    }
                                }
                            })
                        });
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
var mongo = require('../services/mongo');
var ioModel = require('../models/io');
var io = ioModel.io;

var model = {
    inited: (function () {
        return mongo.init
            .then(function () {
                return mongo.getExistedUsers()
            })
            .then(function (users) {
                model.existedUsers = users.map(function (user) {
                    return user.id;
                });
            });
    })(),
    existedUsers: [],
    getUsersPeer: function (currentUser) {
        return new Promise(function (resolve, reject) {
            model.getUsers(currentUser)
                .then(function (users) {
                    users = users.map(function (user) {
                        return user.id;
                    });
                    resolve(ioModel.getSockets()
                        .map(function (socket) {
                            return socket.request.user;
                        })
                        .filter(function (user) {
                            return user && users.indexOf(user.id) !== -1;
                        })
                        .map(function(user) {
                            return user.peerId;
                        }));
                });
        });
    },
    /**
     * Список id пользователей, для которых созданы личные комнаты
     * @param rooms
     * @returns {*}
     */
    filterSelfRooms: function () {
        var rooms = Object.keys(io.sockets.adapter.rooms);
        return rooms
            .map(function (room) {
                return room.split('self_')[1];
            })
            .filter(function (room) {
                return !!room;
            });
    },
    /**
     * Проверяем подключился только что зарегистрированный пользователь или нет
     * @param {User} user
     * @returns {boolean}
     */
    isNew: function (user) {
        return model.existedUsers.indexOf(user.id) === -1;
    },
    /**
     * Найти существующего, или создать запись пользователя
     * по данным из PassportJS.
     * @param {User} profile
     * @returns {Promise}
     */
    findOrCreateUser: function (profile) {
        return model.getUser(profile.id)
            .catch(function (err) {
                if (err !== 'not found') {
                    return Promise.reject(err);
                }
                if(!profile.displayName){
                    profile.displayName = profile.username
                }
                return model.storeUser(profile);
            });
    },
    /**
     * Вернуть учетную запись пользователя
     * @param user.id
     * @returns {Promise}
     */
    getUser: function (id) {
        return mongo.getUserById(id);
    },
    /**
     * Сохранить запись о пользователе в БД
     * @param {User} user
     * @returns {Promise}
     */
    storeUser: function (user) {
        return mongo.storeUser(user);
    },
    /**
     * Сериализация пользователя для пасспорта
     * @param {User} user
     * @returns {Number}
     */
    serializeUser: function (user) {
        return user.id;
    },
    /**
     * Получить информацию о пользователях доступных данному пользователю
     * @param {User} currentUser
     * @returns {*}
     */
    getUsers: function (currentUser) {
        return mongo.getUsers(currentUser);
    }
};

module.exports = model;
var mongo = require('./mongo');

var model = {
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
                return model.storeUser(profile);
            });
    },
    /**
     * Вернуть учетную запись пользователя
     * @param user.id
     * @returns {Promise}
     */
    getUser: function (id) {
        return new Promise(function (resolve, reject) {
            var collection = mongo.db().collection('users');
            collection.findOne({id: id}, function (err, user) {
                if (err) {
                    reject(err);
                }

                if (user) {
                    resolve(user);
                } else {
                    reject('not found');
                }
            });
        })
    },
    /**
     * Сохранить запись о пользователе в БД
     * @param {User} user
     * @returns {Promise}
     */
    storeUser: function (user) {
        return new Promise(function (resolve, reject) {
            var collection = mongo.db().collection('users');
            collection.insert({
                id: user.id,
                _full: user,
                userName: user.username,
                displayName: user.displayName,
                email: user.email,
                profileUrl: user.profileUrl,
                avatarUrl: user._json.avatar_url
            }, function (err, user) {
                if (err) {
                    reject(err);
                } else {
                    resolve(user)
                }
            });
        });
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
     * Подключился новый пользователь
     * @param {Socket} socket
     */
    newUser: function (socket) {
        console.log('new user');
    }
};

module.exports = model;
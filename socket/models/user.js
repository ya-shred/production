var mongo = require('../services/mongo');

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
    }
};

module.exports = model;
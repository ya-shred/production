var mongo = require('./mongo');

var model = {
    /*
     Найти существующего, или создать запись пользователя
     по данным из PassportJS.
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
    /*
     Вернуть учетную запись пользователя
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


    /*
     Сохранить запись о пользователе в БД
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

    serializeUser: function (user) {
        return user.id;
    }
};

module.exports = model;
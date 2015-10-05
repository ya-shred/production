var MongoClient = require('mongodb').MongoClient;
var config = require('config');

// Connection URL
var url = config.get('dbConnectionUrl');
var db = null;
// Use connect method to connect to the Server
MongoClient.connect(url, function (err, dbLink) {
    if (err) {
        console.error('Ошибка подключения к БД', err);
        process.exit(1);
    }
    console.log('Успешно подключились к БД');
    db = dbLink;
});

model = {
    close: function () {
        console.log('close connection');
        db.close();
    },
    db: function () {
        return db;
    },
    /**
     * Вернуть учетную запись пользователя
     * @param user.id
     * @returns {Promise}
     */
    getUserById: function (userId) {
        return new Promise(function (resolve, reject) {
            var collection = db.collection('users');
            collection.findOne({id: userId}, function (err, user) {
                if (err) {
                    reject(err);
                }

                if (user) {
                    resolve(user);
                } else {
                    reject('not found');
                }
            });
        });
    },
    /**
     * Сохранить запись о пользователе в БД
     * @param {User} user
     * @returns {Promise}
     */
    storeUser: function (user) {
        return new Promise(function (resolve, reject) {
            var collection = db.collection('users');
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

    getHistory: function (user) {
        return new Promise(function (resolve, reject) {
            resolve([{channel: 'test', message: 'test'}]);
        });
    },
    getChannels: function (user) {
        return new Promise(function (resolve, reject) {
            // Get the documents collection
            var collection = db.collection('channels');
            // Find some documents
            collection.find().toArray(function (err, result) {
                if (err) {
                    return reject(err);
                }

                resolve(result);
            });
        });
    },

    getUsers: function (user) {
        return new Promise(function (resolve, reject) {
            // Get the documents collection
            var collection = db.collection('users');
            // Find some documents
            collection.find().toArray(function (err, result) {
                if (err) {
                    return reject(err);
                }

                resolve(result);
            });
        });
    }
};

module.exports = model;
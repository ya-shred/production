var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var ObjectId = mongo.ObjectID;
var config = require('config');

// Connection URL
var url = config.get('dbConnectionUrl');
var db = null;

model = {
    close: function () {
        console.log('close connection');
        db.close();
    },

    init: (function () {
        return new Promise(function (resolve, reject) {
            // Use connect method to connect to the Server
            MongoClient.connect(url, function (err, dbLink) {
                if (err) {
                    console.error('Ошибка подключения к БД', err);
                    reject();
                    process.exit(1);
                }
                console.log('Успешно подключились к БД');
                resolve();
                db = dbLink;
            });
        });
    })(),

    /**
     * Вернуть учетную запись пользователя
     * @param user.id
     * @returns {Promise}
     */
    getUserById: function (userId) {
        return new Promise(function (resolve, reject) {
            var collection = db.collection('users');
            collection.find({id: userId}).limit(1).next(function (err, user) {
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
            collection.insertOne({
                id: user.id,
                _full: user,
                userName: user.username,
                displayName: user.displayName,
                email: user.email,
                profileUrl: user.profileUrl,
                avatarUrl: user._json.avatar_url,
                messageAvailable: 0,
                messageUsed: 0
            }, function (err, doc) {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc.ops[0])
                }
            });
        });
    },

    getHistory: function () {
        return new Promise(function (resolve, reject) {
            var collection = db.collection('messages');
            collection.find().sort({'datetime': 1}).toArray(function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    insertMessage: function (data) {
        return new Promise(function (resolve, reject) {
            var collection = db.collection('messages');
            collection.insertOne(data, function (err, result) {
                if (err) {
                    return reject(err);
                }
                resolve(result.ops[0]);
            });
        });
    },

    updateMessage: function (data) {
        var collection = db.collection('messages');
        return collection.findOneAndUpdate({id: data.id}, {$set: {additional: data.additional}});
    },

    getChannels: function (user) {
        var collection = db.collection('channels');
        return collection.find().toArray();
    },

    getUsers: function (user) {
        var collection = db.collection('users');
        return collection.find().toArray();
    },

    getExistedUsers: function () {
        var collection = db.collection('users');
        return collection.find().toArray();
    },

    updateUser: function (user) {
        var collection = db.collection('users');
        return collection.findOneAndReplace({id: user.id}, user);
    }
};

module.exports = model;
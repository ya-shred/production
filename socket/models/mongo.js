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

    init: function () {
        return model.inited = MongoClient.connect(url)
            .then(function (dbLink) {
                console.log('Успешно подключились к БД');
                return db = dbLink;
            })
            .catch(function (err) {
                console.error('Ошибка подключения к БД', err);
                process.exit(1);
            });
    },

    /**
     * Вернуть учетную запись пользователя
     * @param user.id
     * @returns {Promise}
     */
    getUserById: function (userId) {
        var collection = db.collection('users');
        return collection.find({id: userId}).limit(1).next()
            .then(function (user) {
                if (!user) {
                    return Promise.reject('not found');
                }
                return user;
            });
    },

    /**
     * Сохранить запись о пользователе в БД
     * @param {User} user
     * @returns {Promise}
     */
    storeUser: function (user) {
        var collection = db.collection('users');
        return collection.insertOne({
            id: user.id,
            _full: user,
            userName: user.username,
            displayName: user.displayName,
            email: user.email,
            profileUrl: user.profileUrl,
            avatarUrl: user._json.avatar_url,
            messageAvailable: 0,
            messageUsed: 0
        })
            .then(function (result) {
                return result.ops[0];
            });
    },

    getHistory: function () {
        var collection = db.collection('messages');
        return collection.find().sort({'datetime': 1}).toArray();
    },

    insertMessage: function (data) {
        var collection = db.collection('messages');
        return collection.insertOne(data)
            .then(function (result) {
                return result.ops[0];
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

    /**
     * Вернуть пользователей, доступных данному пользователю
     * @param {User} user
     * @returns {Promise}
     */
    getUsers: function (user) {
        var collection = db.collection('users');
        return collection.find().toArray();
    },

    /**
     * Вернуть всех зарегистрированных пользователей
     * @param {User} user
     * @returns {Promise}
     */
    getExistedUsers: function () {
        var collection = db.collection('users');
        return collection.find().toArray();
    },

    updateUser: function (user) {
        var collection = db.collection('users');
        return collection.findOneAndReplace({id: user.id}, user);
    },

    removeUserById: function (id) {
        var collection = db.collection('users');
        return collection.remove({id: id});
    }
};

module.exports = model;
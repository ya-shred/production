var MongoClient = require('mongodb').MongoClient;
var config = require('config');

// Connection URL
var url = config.get('dbConnectionUrl');
var db = null;
// Use connect method to connect to the Server
MongoClient.connect(url, function (err, dbLink) {
    console.log("Connected correctly to mongo server");

    db = dbLink;
    db.collection('messages').remove();
});

model = {
    close: function () {
        console.log('close connection');
        db.close();
    },

    checkAndAddUser: function (user) {
        return model.getUser(user)
            .then(function () {
                return false;
            })
            .catch(function (err) {
                if (err === 'not found') {
                    return model.addUser(user);
                } else {
                    return Promise.reject(err);
                }
            })
            .then(function () {
                return true;
            });
    },

    addUser: function (user) {
        return new Promise(function (resolve, reject) {
            var collection = db.collection('users');
            collection.insert(user, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve('added')
                }
            });
        });
    },

    getUser: function (user) {
        return new Promise(function (resolve, reject) {
            var collection = db.collection('users');
            collection.findOne({id: user.id}, function (err, doc) {
                if (err) {
                    reject(err);
                }

                if (doc) {
                    resolve(doc);
                } else {
                    reject('not found');
                }
            });
        })
    },

    save: function (data) {
        return new Promise(function (resolve, reject) {
            // Get the documents collection
            var collection = db.collection('messages');
            // Insert some documents
            collection.insert([
                data
            ], function (err, result) {
                console.log('inserted in history', result);
                if (err) {
                    return reject(err);
                }

                resolve(result);
            });
        });
    },

    getAll: function () {
        return new Promise(function (resolve, reject) {
            // Get the documents collection
            var collection = db.collection('messages');
            // Find some documents
            collection.find({}).toArray(function (err, result) {
                console.log('request history', result);
                if (err) {
                    return reject(err);
                }

                resolve(result);
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
var MongoClient = require('mongodb').MongoClient;
var config = require('config');

// Connection URL
var url = config.get('dbConnectionUrl');
var db = null;
// Use connect method to connect to the Server
MongoClient.connect(url, function (err, dbLink) {
    if (err) {
        return console.error('Ошибка подключения к БД', err);
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
    }
};

module.exports = model;
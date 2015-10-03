var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

/*
 Найти существующего, или создать запись пользователя
 по данным из PassportJS.
 */
function findOrCreateUser(db, profile, callback) {
    var id = profile.id;

    getUser(db, id, onFetchedUser);

    function onFetchedUser(error, user) {
        if (error) { return callback(error); }
        if (user) {
            // Нашли пользователя, можем возвращать
            console.log("findOrCreateUser - found");
            return callback(null, user);
        } else {
            // Пользователь не найден, необходимо создать новую запись и вернуть ее
            console.log("findOrCreateUser - create");
            return storeUser(db, profile, callback);
        }
    }
}
/*
 Вернуть учетную запись пользователя
 */
function getUser(db, id, callback) {
    console.log('load user with id', id);
    MongoClient.connect(db, function(err, db) {
        var collection = db.collection('users');
        collection.findOne({"id": id}, function(err, doc) {
            if (err) { callback(error); }

            if (doc) {
                callback(null, doc);
            } else {
                callback();
            }
        });
    });
}


/*
 Сохранить запись о пользователе в БД
 */
function storeUser(db, user, callback) {
    var id = user.id;
    console.log(user);

    console.log('storeUser with id', id);
    MongoClient.connect(db, function(err, db) {
        var collection = db.collection('users');
        collection.insert({
            id: user.id,
            _full: user,
            userName: user.username,
            displayName: user.displayName,
            email: user.email,
            profileUrl: user.profileUrl,
            avatarUrl: user._json.avatar_url
        }, function(err) {
            if (err) {
                console.error(err);
            } else {
                callback(null, user);
            }
        });
    });
}

function serializeUser(user, callback) {
    callback(null, user.id);
}

module.exports = function (db) {
    return {
        findOrCreateUser: findOrCreateUser.bind(null, db),
        serializeUser: serializeUser,
        deserializeUser: getUser.bind(null, db),
        getUser: getUser.bind(null, db),
        storeUser: storeUser.bind(null, db)
    }
};
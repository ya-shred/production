var passport = require('passport');
var path = require('path');
var expressCookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);
var stylus = require('stylus');
var GitHubStrategy = require('passport-github').Strategy;
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('./socket/models/io').server(server);
var config = require('config');
var busboy = require('connect-busboy');
var fs = require('fs');
var uuid = require('node-uuid');

var userModel = require('./socket/models/user');
var userController = require('./socket/controllers/user');
var fileController = require('./socket/controllers/file');

// Инициализация необходимых модулей
require('./socket/models/mongo').init();
userModel.init();
// конец инициализации

var EXPRESS_SID_KEY = 'connect.sid';
var COOKIE_SECRET = 'shred 15';
var cookieParser = expressCookieParser(COOKIE_SECRET);
var sessionStore = new MongoStore({
    url: config.get('dbConnectionUrl')
});
var session = expressSession({
    secret: COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
    name: EXPRESS_SID_KEY
});

server.listen(config.get('frontPort'), function () {
    var port = server.address().port;
    console.log('Example app listening at http://localhost:%s', port);
});

// view engine setup
app.set('views', path.join(__dirname, 'app/loginViews'));
app.set('view engine', 'hbs');
app.use(cookieParser);
app.use(busboy());

app.use(methodOverride());
app.use(session);

io.use(function (socket, next) {
    cookieParser(socket.request, {}, function (err) {
        var sessionId = socket.request.signedCookies[EXPRESS_SID_KEY];

        sessionStore.get(sessionId, function (err, session) {
            socket.request.session = session;

            passport.initialize()(socket.request, {}, function () {
                passport.session()(socket.request, {}, function () {
                    if (socket.request.user) {
                        next(null, true);
                    } else {
                        next(new Error('User is not authenticated'), false);
                    }
                })
            });
        });
    });
});

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (currentUser, done) {
    done(null, userModel.serializeUser(currentUser));
});

passport.deserializeUser(function (currentUser, done) {
    userModel.getUser(currentUser)
        .then(function (user) {
            done(null, user);
        })
        .catch(function (err) {
            done(null, false);
        });
});

passport.use(new GitHubStrategy({
        clientID: config.get('githubAppId'),
        clientSecret: config.get('githubAppSecret'),
        callbackURL: config.get('githubAppCallback')
    },
    function (accessToken, refreshToken, profile, callback) {
        userModel.findOrCreateUser(profile)
            .then(function (user) {
                callback(null, user);
            })
            .catch(function (err) {
                done(err);
            });
    }
));

app.use('/public', stylus.middleware(path.join(__dirname, 'app/loginPublic')));
app.use('/public', express.static(path.join(__dirname, 'app/loginPublic')));

app.get('/auth/github',
    passport.authenticate('github'),
    function (req, res) {
        // The request will be redirected to GitHub for authentication, so this
        // function will not be called.
    });

app.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/'
}), function () {
    console.log('here');
});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.get('*', function (req, res, next) {
    if (req.session && req.session.passport && req.session.passport.user) {
        return next();
    }

    res.render('index');
});

app.use('/uploads', express.static(path.join(__dirname, 'app/uploads')));

app.use(express.static(path.join(__dirname, 'app/frontendPublic')));

app.post('/savefile', function (req, res, next) {
    console.log('got save file');
    var files = {};
    var type = '';
    if (req.busboy && req.user && req.user.messageAvailable > req.user.messageUsed) {
        req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            var u = uuid.v1();
            var ext = filename.split('.').slice(-1)[0];
            var relativePath = 'uploads/' + u + '.' + ext;
            var saveTo = path.join(__dirname, 'app', relativePath);
            files[fieldname] = {file: file, name: filename, mime: mimetype, url: relativePath, path: saveTo};
            file.pipe(fs.createWriteStream(saveTo));
        });
        req.busboy.on('field', function (key, value, keyTruncated, valueTruncated) {
            type = value;
        });
        req.busboy.on('finish', function () {
            fileController.processFile(type, files)
                .then(function (url) {
                    res.send({url: url});
                })
                .catch(function (err) {
                    res.send({url: '', error: err});
                });
        });
        req.pipe(req.busboy);
    } else {
        res.send('Ошибка загрузки файла');
    }
});

io.on('connection', function (socket) {
    userController.newUser(socket);
});

module.exports = app;
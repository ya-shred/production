var express = require('express'),
    passport = require('passport'),
    path = require('path');
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    MongoClient = require('mongodb').MongoClient,
    MongoStore = require('connect-mongo')(session),
    assert = require('assert');
var stylus = require('stylus');

var config = require('config');

var user = require('./user');

var GitHubStrategy = require('passport-github').Strategy;

var mongoUrl = config.get('dbConnectionUrl');
var api = user(mongoUrl);


var app = express();

// configure Express

var sessionCookie = 'connect.sid';
var sessionOptions = {
    secret: 'shred 15',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        url: mongoUrl
    }),
    name: sessionCookie
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(cookieParser());

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(methodOverride());
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


passport.serializeUser(api.serializeUser);
passport.deserializeUser(api.deserializeUser);

passport.use(new GitHubStrategy({
        clientID: config.get('githubAppId'),
        clientSecret: config.get('githubAppSecret'),
        callbackURL: config.get('githubAppCallback')
    },
    function (accessToken, refreshToken, profile, callback) {
        api.findOrCreateUser(profile, callback);
    }
));

app.get('/', function (req, res) {
    if (req.user) {
        return res.redirect('/auth/github/callback'); // Проверяем, что пользователю разрешен доступ
    }
    res.render('index');

    console.log("Navigated to /");
});

app.get('/login', function (req, res) {
    if (req.user) {
        return api.getUser(req.user.id, redirectToChat.bind(null, req, res));
    }
    res.redirect('/');

    console.log("Navigated to /");
});

app.get('/auth/github',
    passport.authenticate('github'),
    function (req, res) {
        // The request will be redirected to GitHub for authentication, so this
        // function will not be called.
    });

app.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect: '/login',
    failureRedirect: '/'
}));

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/auth/session/:sessionId', function (req, res) {
    var sess = req.params.sessionId;
    sessionOptions.store.get(sess, function (error, session) {
        console.log('request session', session);
        if (error || !session || !session.passport.user) {
            return res.status(400).send('invalid session id');
        }
        api.getUser(session.passport.user, function (err, user) {
            if (err) {
                return res.send('cann\'t find user by session id');
            }
            res.send(user);
        });
    });
});

var server = app.listen(config.get('port'), function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});

var redirectToChat = function (req, res, err, user) {
    console.log('redirect', user);
    res.statusCode = 302;
    res.setHeader("Location", config.get('redirectUrl') + '?' + req.sessionID);
    res.end();
};
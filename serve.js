var express = require('express');
var passport = require('passport');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var stylus = require('stylus');

var config = require('config');

var GitHubStrategy = require('passport-github').Strategy;

var userModel = require('./app/models/user');

var app = express();

// configure Express
var sessionCookie = 'connect.sid';
var sessionOptions = {
    secret: 'shred 15',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        url: config.get('dbConnectionUrl')
    }),
    name: sessionCookie
};

// view engine setup
app.set('views', path.join(__dirname, 'app/loginViews'));
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

passport.serializeUser(function (currentUser, done) {
    done(null, userModel.serializeUser(currentUser));
});

passport.deserializeUser(function (currentUser, done) {
    userModel.getUser(currentUser)
        .then(function (user) {
            done(null, user);
        })
        .catch(function (err) {
            done(err);
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
    if (req.session && req.session.passport.user) {
        return next();
    }

    res.render('index');
});

app.use(express.static(path.join(__dirname, 'app/frontendPublic')));

var server = app.listen(config.get('port'), function () {
    var port = server.address().port;
    console.log('Example app listening at http://lodalhost:%s', port);
});

module.exports = app;
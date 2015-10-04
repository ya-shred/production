var express = require('express');
var passport = require('passport');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var MongoClient = require('mongodb').MongoClient;
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
    console.log(1, currentUser);
    done(null, userModel.serializeUser(currentUser));
});
passport.deserializeUser(function (currentUser, done) {
    console.log(2, currentUser);
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
        console.log(3, profile);
        userModel.findOrCreateUser(profile)
            .then(function (user) {
                user.authenticated = true;
                callback(null, user);
            })
            .catch(function (err) {
                done(err);
            });
    }
));


app.use('/public', stylus.middleware(path.join(__dirname, 'app/loginPublic')));
app.use('/public', express.static(path.join(__dirname, 'app/loginPublic')));

function isAuthenticated(req, res, next) {
    console.log(4, req.user);

    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    //console.log(1, req.user);
    if (req.user && req.user.authenticated) {
        console.log(1);
        return next();
    }

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.render('index');
}

app.get('/', isAuthenticated, function (req, res, next) {
    console.log(5);
    passport.authenticate('github', function (err, user, info) {
        console.log(6);
        if (err || !user) {
            return res.render('index');
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.render('index');
            }
            return next();
        });
    })(req, res, next);
});

app.use(express.static(path.join(__dirname, 'app/frontendPublic')));

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

var server = app.listen(config.get('port'), function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
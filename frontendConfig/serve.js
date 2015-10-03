var express = require('express');
var path = require('path');
var app = express();

var port = process.env.PORT || 3000;

var sessionCookie = 'connect.sid';

app.get('/', function(request, response, next) {
    console.log(request.url);
    var parsed = request.url.split('?');
    if (parsed[1]) {
        response.setHeader('Set-Cookie', ['connect.id=' + parsed[1]]);
        response.redirect(parsed[0]);
        return response.end();
    }
    next();
});

app.use(express.static(path.join(__dirname, 'build')));


app.listen(port);
console.log('server listening at ', port);
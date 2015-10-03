var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.dev.config.js');

var server = new WebpackDevServer(webpack(config), {
  hot: true, // перезагружает только при изменении js файлов, если поменяли стили не перезагрузит автоматом
  noInfo: true,
  setup: function(app) {
    app.get('/', function(request, response, next) {
      var parsed = request.url.split('?');
      if (parsed[1]) {
        response.setHeader('Set-Cookie', ['connect.id=' + parsed[1]]);
        return response.redirect(parsed[0]);
      }
      next();
    });
  }
});

server.listen(3000, 'localhost', function (err) {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:3000');
});

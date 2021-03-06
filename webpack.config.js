var webpack = require('webpack');
var path = require('path');
var file = require('file-loader');
var imageWebpack = require('image-webpack-loader');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var TextPlugin = require('extract-text-webpack-plugin');

var config = {

    entry: [
        './frontend/app.js' // главный файл
    ],

    output: {
        path: path.join(__dirname, 'app/frontendPublic/')
    },

    plugins: [
        new TextPlugin("index.css"), // Вставляет стили отдельным файлом

        new HtmlWebpackPlugin({ // Генерируем выходной html из шаблона. Подключаем автоматом index.css и bundle.js
            template: 'frontend/index.html',
            inject: true
        })
    ],
    module: {
        loaders: [
            {
                test: /\.js?$/,
                loader : 'babel',
                query: {
                    optional: ["runtime"], // добавляет функции на типа _extend глобально, а не для каждого модуля
                    stage: 0
                },
                exclude: /node_modules/
            },{
                test: /\.styl$/,
                loader: TextPlugin.extract('style-loader','css-loader!autoprefixer-loader?browsers=last 5 version!stylus-loader?resolve url=true')
            },{
                test: /\.(png|woff|woff2|eot|ttf|svg)($|\?)/,
                loader: 'url-loader',
                query: {
                    limit: '8192'
                }
            }
        ]
    },
    stylus: {
        'resolve url': true
    }

};

module.exports = config;
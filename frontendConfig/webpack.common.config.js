var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var TextPlugin = require('extract-text-webpack-plugin');

var config = {

    entry: [
        './app/app.js' // главный файл
    ],

    output: {
        path: path.join(__dirname, 'build')
    },

    plugins: [
        new TextPlugin("index.css"), // Вставляет стили отдельным файлом

        new HtmlWebpackPlugin({ // Генерируем выходной html из шаблона. Подключаем автоматом index.css и bundle.js
            //template: './index.html',
            template: 'app/index.html',
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
                loader: TextPlugin.extract('style-loader','css-loader!autoprefixer-loader?browsers=last 5 version!stylus-loader')
            },{
                test: /\.(png|woff|woff2|eot|ttf|svg)($|\?)/,
                loader: 'url-loader',
                query: {
                    limit: '8192'
                }
            }
        ]

    }

};

module.exports = config;
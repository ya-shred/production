var mongo = require('../models/mongo.js');
var file = require('file.js');
var userModel = require('../models/user');
var config = require('config');
var stripe = require("stripe")(config.get('stripeKey'));


var FILE_HANDLERS = {
    error: 'onErrorMessage',
    simple_file: 'onSimpleFile',
    video_message: 'onVideoMessage'
};

var model = {
    handlers: {
        onSimpleFile: function (files) {
            return files.file.url
        },

        onVideoMessage: function (files) {

        },

        onErrorMessage: function () {
            return Promise.reject({
                type: 'status',
                data: {
                    status: 'error',
                    message: 'unknown command'
                }
            });
        }

    },
    processFile: function (type, files) {
        var messageHandler = model.handlers[FILE_HANDLERS[type]];
        if (!messageHandler) {
            return Promise.resolve(model.handlers[FILE_HANDLERS['error']]());
        }

        return Promise.resolve(messageHandler(files))
            .catch(function (error) {
                return Promise.reject('Неизвестный формат файла');
            });
    }
};

module.exports = model;
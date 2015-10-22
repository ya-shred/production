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
        onSimpleFile: function (message) {
        },

        onVideoMessage: function (message) {
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
    processFile: function (message) {
        var messageHandler = model.handlers[FILE_HANDLERS[message.type]];
        if (!messageHandler) {
            return Promise.resolve(model.handlers[FILE_HANDLERS['error']]());
        }

        return Promise.resolve(messageHandler(message))
            .catch(function (error) {
                return Promise.reject({
                    type: 'status',
                    data: {
                        status: 'error',
                        message: error
                    }
                });
            });
    }
};

module.exports = model;
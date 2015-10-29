var ffmpeg = require('fluent-ffmpeg');
var path = require('path');
var uuid = require('node-uuid');
var fs = require('fs');

var FILE_HANDLERS = {
    simple_file: 'onSimpleFile',
    video_message: 'onVideoMessage'
};

var model = {
    handlers: {
        onSimpleFile: function (files) {
            return files.file.url
        },

        onVideoMessage: function (files) {
            return new Promise(function (resolve, reject) {
                var fileUrl = 'uploads/' + uuid.v1() + '.mp4';
                ffmpeg()
                    .addInput(files.audio.path)
                    .addInput(files.video.path)
                    .on('error', function(err) {
                        console.log('error2', arguments);
                        reject(err);
                    })
                    .on('end', function() {
                        console.log('merged');
                        fs.unlinkSync(files.audio.path);
                        fs.unlinkSync(files.video.path);
                        resolve(fileUrl);
                    })
                    .save(path.join('app', fileUrl));
            });
        }
    },
    processFile: function (type, files) {
        var messageHandler = model.handlers[FILE_HANDLERS[type]];
        if (!messageHandler) {
            return Promise.resolve('Неизвестный формат файла');
        }

        return Promise.resolve(messageHandler(files))
            .catch(function (error) {
                return Promise.reject(error);
            });
    }
};

module.exports = model;
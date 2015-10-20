import React from 'react';
import VideoAudio from './videoAudio'

let PLUGINS = {
    'simple_message': 'simple',
    'simple_file': 'file',
    'video_message': 'video'
};

let model = {
    arrayToBlob: (file, mime) => {
        return file  instanceof Blob ? file : new Blob([file], {type: mime});
    },
    getFileUrl: (file) => {
        return window.URL.createObjectURL(file);
    },
    getArrayUrl: (file, mime) => {
        return model.getFileUrl(model.arrayToBlob(file, mime));
    },
    plugins: {
        simple: (data) => {
            return data.message;
        },
        file: (data) => {
            let url = model.getArrayUrl(data.file, data.mime);
            return (
                <span>Пользователь загрузил файл:
                    <a href={url}>{data.name}</a>
                </span>
            );
        },
        video: (data) => {
            let videoUrl = model.getArrayUrl(data.video, data.videoMime);
            let audioUrl = model.getArrayUrl(data.audio, data.audioMime);
            return (
                <VideoAudio video={videoUrl} audio={audioUrl}/>
            )
        }
    },
    transform: (type, data) => {
        if (!PLUGINS[type]) {
            console.log('cannot find type', type);
            return '';
        } else {
            return model.plugins[PLUGINS[type]](data);
        }
    }
};

export default model;
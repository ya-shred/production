import React from 'react';
import VideoAudio from './videoAudio'

let PLUGINS = {
    'simple_message': 'simple',
    'simple_file': 'file',
    'video_message': 'video',
    'simple_file_saved': 'url'
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
        },
        url: (data) => {
            let url = data.url;
            let ext = url.split('.').slice(-1)[0];
            if (['png', 'jpg', 'gif'].indexOf(ext) !== -1) {
                return (
                    <img src={url} className="message-tr__img"/>
                )
            } else if (['mp4'].indexOf(ext) !== -1) {
                return (
                    <video src={url} className="message-tr__img" controls />
                )
            }
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
import React from 'react';
import VideoAudio from './videoAudio'
import MessageStore from '../../stores/message'
import UsersListStore from '../../stores/usersList';
import MessageItem from "../messageItem";

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
            let res = [];
            let message = data.message;
            let exp = /{([^{]*)}/g;
            let str, ind, firstPart, replyMessage, messageUser;
            while (str = exp.exec(message)) {
                replyMessage = MessageStore.getMessageById(str[1]);
                if (replyMessage) { // Если пользователь цитирует другого
                    messageUser = UsersListStore.getUserById(replyMessage.userId);
                    ind = message.indexOf(str[0]);
                    firstPart = message.slice(0, ind);
                    res.push((<span key={res.length}>{firstPart}</span>));
                    res.push((
                        <MessageItem
                            key={replyMessage.id}
                            messageUser={messageUser}
                            messageObj={replyMessage}
                            disabled={true}
                            />
                    ));
                    message = message.slice(ind + str[0].length);
                }
            }
            if (res.length) {
                res.push((<span key={res.length}>{message}</span>));
                return (<span>{res}</span>);
            }

            return message;
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
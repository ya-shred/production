import React from 'react';
import Actions from '../constants/message';
import ActionsFile from '../constants/file';
import ActionsUsersList from '../constants/usersList';
import AppDispatcher from '../dispatchers/dispatcher';
import assign  from 'react/lib/Object.assign';
import UsersListStore from './usersList';
import FileStore from './file';
import BaseStore from './base';
import AjaxAPI from '../utils/ajax';
import SocketAPI from '../utils/socket';
import _ from 'lodash';

let messages = [];

let addItem = function (message) {
    messages.push(message);
};

let saveHistory = function(his) {
    messages = messages.concat(his);
};

let searchMessage = (text) => {
    if (text){
        return messages.filter((message) => {
            if (message.type === 'simple_message') {
                let messageUser = UsersListStore.getUserById(message.userId);
                let userDisplayName = messageUser.displayName || messageUser.userName;
                userDisplayName = userDisplayName.toLowerCase();
                let messageText = message.additional.message.toLowerCase();
                let test = text.toLowerCase();

                return userDisplayName.indexOf(test) > -1 || messageText.indexOf(test) > -1;
            }
        });
    } else{
        return messages
    }
};

let searchUserLastMessage = (userId) => {
    let lastMessage = _.findLast(messages, (message) => {
        return message.userId === userId;
    });
    return lastMessage;
};

let countUserMessageNumber = (userId) => {
    let userMessagesNumber = messages.filter((message) => {
        return message.userId === userId;
    });
    return userMessagesNumber.length;
};

let updateMessage = (message) => {
    for (let key in messages) {
        if (messages[key].id === message.id) {
            messages[key].additional = message.additional;
            break;
        }
    }
};

let receiveFile = (fileObj) => {
    addItem(fileObj);
};

let searchMessageText = '';

let makeFromData = (data) => {
    let flat = null;
    switch (data.type) {
        case 'simple_file':
            flat = {
                type: data.type,
                file: data.additional.file
            };
            break;
        case 'video_message':
            flat = {
                type: data.type,
                video: data.additional.video,
                audio: data.additional.audio
            };
            break;
    }

    let form = new FormData();

    for (let key in flat) {
        form.append(key, flat[key]);
    }
    return form;
};

const store = assign({}, BaseStore, {

    getAllMessages() {
        return messages;
    },

    getCurrentMessages() {

        if (UsersListStore.getAllUsers().length){
            return searchMessage(searchMessageText);
        } else {
            return [];
        }

    },

    getUserLastMessage(userId) {
        return searchUserLastMessage(userId);
    },

    countUserMessagesNumber(userId) {
        return countUserMessageNumber(userId);
    },

    getMessageById(id) {
        let res = null;
        messages.some((el) => {
            if (el.id === id) {
                return res = el;
            }
        });
        return res;
    },

    dispatcherIndex: AppDispatcher.register(function (payload) {

        var action = payload.action;
        switch (action.actionType) {
            case Actions.NEW_MESSAGE:
                addItem(action.message);
                store.emitChange();
                break;
            case Actions.HISTORY_MESSAGE:
                saveHistory(action.message);
                store.emitChange();
                break;
            case Actions.SEARCH_MESSAGE:
                searchMessageText = action.text;
                store.emitChange();
                break;
            case Actions.GET_UPDATED_MESSAGE:
                updateMessage(action.message);
                store.emitChange();
                break;
            case ActionsFile.RECEIVE_FILE:
                receiveFile(action.data);
                store.emitChange();
                break;
            case ActionsUsersList.RESET_USERS:
                store.emitChange();
                break;
            case Actions.SAVE_FILE_MESSAGE:
                let sendData = makeFromData(action.data);
                action.data.type = 'simple_message';
                action.data.additional = {
                    message: 'Идёт сохранение файла, не перезагружайте страницу',
                    disabled: false
                };
                store.emitChange();
                AjaxAPI.saveFile(sendData)
                    .then((url) => {
                        if (url) {
                            action.data.additional = {url: url};
                            action.data.type = 'simple_file_saved';
                            SocketAPI.saveMiddleMessage(action.data);
                            store.emitChange();
                        } else {
                            action.data.additional.message = 'Ошибка при сохранении файла';
                            store.emitChange();
                        }
                    });
                break;
        }
        return true;
    })

});

export default store;
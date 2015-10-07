import Actions from '../constants/message.js';
import AppDispatcher from '../dispatchers/dispatcher';
import assign  from 'react/lib/Object.assign';
import UsersListStore from './usersList';
import BaseStore from './base';

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
            let messageUser = UsersListStore.getUserById(message.userId);
            let userDisplayName = messageUser.displayName.toLowerCase();
            let messageText = message.message.toLowerCase();
            let test = text.toLowerCase();

            return userDisplayName.indexOf(test) > -1 || messageText.indexOf(test) > -1;
        });
    } else{
        return messages
    }
};

let updateMessage = (message) => {
    console.log("id: " + message.id + ", text: " + message.message);
    for (let key in messages) {
        if (messages[key].id === message.id) {
            messages[key].message = message.message;
            break;
        }
    }
};

let searchMessageText;

const store = assign({}, BaseStore, {
    
    getAllMessages: function () {
        return messages;
    }

});

AppDispatcher.register(function (payload) {
    var action = payload.action;
    switch (action.actionType) {
        case Actions.NEW_MESSAGE:
            addItem(action.message);
        break;
        case Actions.HISTORY_MESSAGE:
            saveHistory(action.message);
        break;
        case Actions.SEARCH_MESSAGE:
            searchMessageText = payload.action.text;
            break;
        case Actions.GET_UPDATED_MESSAGE:
            updateMessage(payload.action.message);
            break;

    }
    store.emitChange();
    return true;
});

module.exports = store;
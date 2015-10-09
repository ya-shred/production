import Actions from '../constants/message.js';
import AppDispatcher from '../dispatchers/dispatcher';
import assign  from 'react/lib/Object.assign';
import BaseStore from './base';

let messages = [];

let addItem = function (message) {
    messages.push(message);
};

let saveHistory = function(his) {
    messages = messages.concat(his);
};

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
    }
    store.emitChange();
    return true;
});

module.exports = store;
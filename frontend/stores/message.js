import Actions from '../constants/message.js';
import AppDispatcher from '../dispatchers/dispatcher';
import assign  from 'react/lib/Object.assign';
import { EventEmitter } from 'events';
const CHANGE_EVENT = 'change';

let messages = [];

let addItem = function (message) {
    messages.push(message);
};

let saveHistory = function(his) {
    messages = messages.concat(his);
};

const AppStore = assign({}, EventEmitter.prototype, {

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback)
    },

    removeChangeListener: function (callback) {
        this.removeChangeListener(CHANGE_EVENT, callback);
    },

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
    AppStore.emitChange();
    return true;
});



module.exports = AppStore;
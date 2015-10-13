import Actions from '../constants/message.js';
import AppDispatcher from '../dispatchers/dispatcher';
import assign  from 'react/lib/Object.assign';
import { EventEmitter } from 'events';
const CHANGE_EVENT = 'change';

var messages = [];


var addItem = function (message) {
    messages.push(message);
};

var saveHistory = function(his) {
    for(var i = 0; i < his.length; i++) {
        messages.push(his[i]);
    }
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
    },

    getHistoryMessages: function () {
        return historyMessage;
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
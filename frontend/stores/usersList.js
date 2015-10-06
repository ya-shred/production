import Actions from '../constants/usersList';
import AppDispatcher from '../dispatchers/dispatcher';
import assign  from 'react/lib/Object.assign';
import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';

const users = [];

var addItem = function (items) {
    users.push.apply(users, items);
};

var resetItems = function (items) {
    users.length = 0;
    addItem(items);
};

var setOnline = function (userId) {
    users.some(function (el) {
       if (el.id === userId) {
           return el.online = true;
       }
    });
};

var setOffline = function (userId) {
    users.some(function (el) {
       if (el.id === userId) {
           el.online = false;
           return true;
       }
    });
};

const store = assign({}, EventEmitter.prototype, {

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback)
    },

    removeChangeListener: function (callback) {
        this.removeChangeListener(CHANGE_EVENT, callback);
    },

    getAllUsers: function () {
        return users;
    },

    dispatcherIndex: AppDispatcher.register(function (payload) {

        var action = payload.action;

        switch (action.actionType) {
            case Actions.RESET_USERS:
                resetItems(action.data.users);
                store.emitChange();
                break;
            case Actions.NEW_USER:
                addItem([action.data.user]);
                store.emitChange();
                break;
            case Actions.USER_CONNECTED:
                setOnline(action.data.userId);
                store.emitChange();
                break;
            case Actions.USER_DISCONNECTED:
                setOffline(action.data.userId);
                store.emitChange();
                break;
        }

        return true;
    })

});

module.exports = store;
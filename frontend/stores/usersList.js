import Actions from '../constants/usersList';
import AppDispatcher from '../dispatchers/dispatcher';
import assign  from 'react/lib/Object.assign';
import BaseStore from './base';

const users = [];
const usersHash = {};

var addItem = function (items) {
    users.push.apply(users, items);
    items.forEach((item) => {
        usersHash[item.id] = item;
    });
};

var resetItems = function (items) {
    users.length = 0;
    addItem(items);
};

var setOnline = function (userId) {
    usersHash[userId].online = true;
};

var setOffline = function (userId) {
    usersHash[userId].online = false;
};

let searchUser = (text) => {
    if (text) {
        return users.filter((user) => {
            let userDisplayName = user.displayName.toLowerCase();
            let test = text.toLowerCase();
            return userDisplayName.indexOf(test) > -1;
        });

    } else {
        return users.sort(function (a, b) {
            if (a.online === b.online) {
                if (a.displayName < b.displayName) {
                    return -1;
                }
                if (a.displayName > b.displayName) {
                    return 1;
                }
            }
            if (a.online === true) {
                return -1;
            }
            return 1;
        });
    }
};

let searchUserText;

const store = assign({}, BaseStore, {

    getAllUsers() {
        return users;
    },

    getCurrentUsers() {
        return searchUser(searchUserText);
    },

    getUserById(id) {
        return usersHash[id];
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
            case Actions.SEARCH_USER:
                searchUserText = action.text;
                store.emitChange();
                break;
        }

        return true;
    })

});

module.exports = store;
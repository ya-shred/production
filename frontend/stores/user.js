import Actions from '../constants/user.js';
import AppDispatcher from '../dispatchers/dispatcher';
import assign  from 'react/lib/Object.assign';
import BaseStore from './base';
import UsersListStore from './usersList';

let userInfo = {};

const store = assign({}, BaseStore, {

    getUserInfo: function () {
            return userInfo;
    },

    dispatcherIndex: AppDispatcher.register(function (payload) {

        var action = payload.action;

        switch (action.actionType) {
            case Actions.INFO_FETCHED:
                userInfo = action.info;
                store.emitChange();
                break;
        }

        return true;
    })

});

module.exports = store;
import Actions from '../constants/user.js';
import AppDispatcher from '../dispatchers/dispatcher';
import assign  from 'react/lib/Object.assign';
import BaseStore from './base';
import UsersListStore from './usersList';
import SocketAPI from '../utils/socket';

let userInfo = {};
let paymentInProgress = false;

let newPayment = function(data) {
    paymentInProgress = true;
    SocketAPI.makePayment(data);
};

const store = assign({}, BaseStore, {

    getUserInfo: function () {
        return userInfo;
    },

    isPaymentProgress: function () {
        return paymentInProgress;
    },

    dispatcherIndex: AppDispatcher.register(function (payload) {

        var action = payload.action;

        switch (action.actionType) {
            case Actions.INFO_FETCHED:
                userInfo = action.info;
                paymentInProgress = false;
                store.emitChange();
                break;
            case Actions.NEW_PAYMENT:
                newPayment(action.data);
                store.emitChange();
                break;
        }

        return true;
    })

});

module.exports = store;
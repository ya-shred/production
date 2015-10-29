import Actions from '../constants/user';
import ActionsMessage from '../constants/message';
import AppDispatcher from '../dispatchers/dispatcher';
import assign  from 'react/lib/Object.assign';
import BaseStore from './base';
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
            case ActionsMessage.SAVE_FILE_MESSAGE:
                userInfo.messageUsed++;
                store.emitChange();
                break;
        }

        return true;
    })

});

module.exports = store;
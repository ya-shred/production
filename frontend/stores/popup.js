import Actions from '../constants/popup';
import AppDispatcher from '../dispatchers/dispatcher';
import assign  from 'react/lib/Object.assign';
import BaseStore from './base';

let popup = null;

const store = assign({}, BaseStore, {

    show: (popupView) => {
        popup = popupView;
        store.emitChange();
    },

    getPopup: () => {
        return popup;
    },

    dispatcherIndex: AppDispatcher.register(function (payload) {

        var action = payload.action;

        switch (action.actionType) {
            case Actions.HIDE_POPUP:
                store.show();
                break;
            case Actions.SHOP_POPUP:
                store.show(action.data);
                break;
        }
        return true;
    })

});

module.exports = store;
import Actions from '../constants/replay';
import AppDispatcher from '../dispatchers/dispatcher';
import assign  from 'react/lib/Object.assign';
import BaseStore from './base';

let id;

const store = assign({}, BaseStore, {
    getReplayId: () => {
        return id;
    },

    dispatcherIndex: AppDispatcher.register(function (payload) {
        var action = payload.action;
        switch (action.actionType) {
            case Actions.REPLAY:
                id = action.data;
                store.emitChange();
                break;
        }
    })
});

module.exports = store;
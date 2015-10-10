import AppDispatcher from '../dispatchers/dispatcher';

import { NEW_MESSAGE, SEND_MESSAGE, SEARCH_MESSAGE, HISTORY_MESSAGE, SEND_UPDATED_MESSAGE, GET_UPDATED_MESSAGE } from '../constants/message';

import SocketActions from './socket';

export default {
    sendMessage: function (data) {
        SocketActions.sendMessage(data);
        AppDispatcher.handleViewAction({
            actionType: SEND_MESSAGE,
            message: data
        });
    },

    getHistory: function (data) {
        AppDispatcher.handleSocketAction({
            actionType: HISTORY_MESSAGE,
            message: data.history
        });
    },

    newMessage: function (data) {
        AppDispatcher.handleSocketAction({
            actionType: NEW_MESSAGE,
            message: data.message
        });
    },

    searchMessage(text) {
        AppDispatcher.handleViewAction({
            actionType: SEARCH_MESSAGE,
            text: text
        });
    },

    sendUpdatedMessage(data) {
        SocketActions.sendUpdatedMessage(data);
    },

    getUpdatedMessage(data) {
        AppDispatcher.handleViewAction({
            actionType: GET_UPDATED_MESSAGE,
            message: data
        });
    }
};
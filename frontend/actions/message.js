import AppDispatcher from '../dispatchers/dispatcher';

import Action from '../constants/message';
import SocketAPI from '../utils/socket';

export default {
    sendMessage: function (data) {
        SocketAPI.sendMessage(data);
        AppDispatcher.handleViewAction({
            actionType: Action.SEND_MESSAGE,
            message: data
        });
    },

    getHistory: function (data) {
        AppDispatcher.handleSocketAction({
            actionType: Action.HISTORY_MESSAGE,
            message: data.history
        });
    },

    newMessage: function (data) {
        AppDispatcher.handleSocketAction({
            actionType: Action.NEW_MESSAGE,
            message: data.message
        });
    },

    searchMessage(text) {
        AppDispatcher.handleViewAction({
            actionType: Action.SEARCH_MESSAGE,
            text: text
        });
    },

    sendUpdatedMessage(data) {
        SocketAPI.sendUpdatedMessage(data);
    },

    getMoreMessage() {
        SocketAPI.sendMoreMessage();
    },

    getUpdatedMessage(data) {
        AppDispatcher.handleViewAction({
            actionType: Action.GET_UPDATED_MESSAGE,
            message: data
        });
    },

    cancelUpdatingMessage(data) {
        AppDispatcher.handleViewAction({
            actionType: Action.CANCEL_UPDATING_MESSAGE,
            message: data
        });
    },

    saveFileMessage(data) {
        AppDispatcher.handleViewAction({
            actionType: Action.SAVE_FILE_MESSAGE,
            data: data
        });
    }
};
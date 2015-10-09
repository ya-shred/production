import AppDispatcher from '../dispatchers/dispatcher';
import { NEW_MESSAGE, SEND_MESSAGE, HISTORY_MESSAGE } from '../constants/message';
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
    }
};
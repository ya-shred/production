import AppDispatcher from '../dispatchers/dispatcher';
import { NEW_MESSAGE, SEND_MESSAGE, HISTORY_MESSAGE } from '../constants/message';
import SocketAPI from '../utils/socket.js'

export default {

    sendMessage: function (data) {
        SocketAPI.sendMessage(data);
    },

    getHistory: function (data) {
        AppDispatcher.handleSocketAction({
            actionType: HISTORY_MESSAGE,
            message: data
        });
    },

    newMessage: function (data) {
        AppDispatcher.handleSocketAction({
            actionType: NEW_MESSAGE,
            message: data
        });
    }
};
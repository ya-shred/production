import AppDispatcher from '../dispatchers/dispatcher';
import { NEW_MESSAGE, SEND_MESSAGE } from '../constants/message';
import SocketActions from './socket';

export default {
    sendMessage: function (data) {
        SocketActions.sendMessage(data);
        console.log(data);
        AppDispatcher.handleViewAction({
            actionType: SEND_MESSAGE,
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
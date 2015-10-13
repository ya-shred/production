import AppDispatcher from '../dispatchers/dispatcher';
import {NEW_USER, RESET_USERS, USER_CONNECTED, USER_DISCONNECTED} from '../constants/usersList';

export default {

    newUser: function (data) {
        console.log('NEW USER',data);
        AppDispatcher.handleSocketAction({
            actionType: NEW_USER,
            data: data
        });
    },

    resetUsers: function (data) {
        console.log('RESET USER', data);
        AppDispatcher.handleSocketAction({
            actionType: RESET_USERS,
            data: data
        });
    },

    userConnected: function (data) {
        console.log('CONNECT USER',data);

        AppDispatcher.handleSocketAction({
            actionType: USER_CONNECTED,
            data: data
        });
    },

    userDisconnected: function (data) {
        AppDispatcher.handleSocketAction({
            actionType: USER_DISCONNECTED,
            data: data
        });
    }
};
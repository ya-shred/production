import cookie from 'react-cookie'
import UserActions from '../actions/user';
import UsersListActions from '../actions/usersList';
import MessageActions from '../actions/message';
import '../../socket/client';

var MESSAGES_HANDLERS = {
    new_message: 'onNewMessage',
    users_info: 'onNewUsers',
    user_connected: 'onUserConnected',
    user_disconnected: 'onUserDisconnected',
    new_user: 'onNewUser'
};

var socket = null;

var model = {
    init: function () {
        socket = socketClient.connect(
            function (numberOfConnect) {

            }, function (message) {
                console.log('new message', message);
                var handler = MESSAGES_HANDLERS[message.type];
                if (!handler) {
                    console.log('Неизвестное сообщение');
                } else {
                    model.handlers[handler](message);
                }
            });
    },
    handlers: {
        onNewMessage: function (message) {
            MessageActions.newMessage(message.data);
        },
        onNewUsers: function (message) {
            UsersListActions.resetUsers(message.data);
        },
        onUserConnected: function (message) {
            UsersListActions.userConnected(message.data);
        },
        onUserDisconnected: function (message) {
            UsersListActions.userDisconnected(message.data);
        },
        onNewUser: function (message) {
            UsersListActions.newUser(message.data);
        }
    },
    sendMessage: function (data) {
        data.type = 'send_message';
        socket.send(data);
    }
};

model.init();

export default model;
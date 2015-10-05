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

var model = {
    inited: false,
    init: function () {
        //var session = cookie.load('connect.id');
        //if (session) {
            socketClient.init()
                //.then(function (data) {
                //    console.log('Успешно авторизовались');
                //    model.inited = true;
                //    UserActions.infoFetched(data);
                //
                //    socketClient.listen(function(message) {
                //        console.log('new message', message);
                //        var handler = MESSAGES_HANDLERS[message.type];
                //        if (!handler) {
                //            console.log('Неизвестное сообщение');
                //        } else {
                //            model.handlers[handler](message);
                //        }
                //    });
                //})
                //.catch(function (error) {
                //    console.log(error); // TODO: добавить обработку ошибки авторизации
                //});
        //}
    },
    handlers: {
        onNewMessage: function (message) {
            MessageActions.newMessage(message.data);
        },
        onNewUsers: function(message) {
            UsersListActions.resetUsers(message.data);
        },
        onUserConnected: function(message) {
            UsersListActions.userConnected(message.data);
        },
        onUserDisconnected: function(message) {
            UsersListActions.userDisconnected(message.data);
        },
        onNewUser: function(message) {
            UsersListActions.newUser(message.data);
        }
    },
    sendMessage: function (data) {
        if (model.inited) {
            data.type = 'send_message';
            socketClient.send(data);
        }
    }
};

model.init();

export default model;
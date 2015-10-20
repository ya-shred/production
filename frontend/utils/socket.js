import cookie from 'react-cookie'
import UserActions from '../actions/user';
import UsersListActions from '../actions/usersList';
import MessageActions from '../actions/message';
import '../../socket/client';
import VideoActions from '../actions/video'
import FileActions from '../actions/file'
import VideoMessageActions from '../actions/videoMessage'

var MESSAGES_HANDLERS = {
    new_message: 'onNewMessage',
    history_response: 'onHistory',
    get_updated_message: 'onGetUpdatedMessage',
    users_list_response: 'onUsersList',
    user_info_response: 'onUserFetched',
    user_connected: 'onUserConnected',
    user_disconnected: 'onUserDisconnected',
    new_user: 'onNewUser',
    status: 'onStatus',
    peers_response: 'onGotPeers'
};

var socket = null;

var model = {
    init: function () {
        socket = socketClient.connect(
            function (numberOfConnect) {
                if (numberOfConnect === 1) { // Первое подключение
                    socket.send({type: 'user_info_request'});
                    socket.send( { type: 'history_request'} );
                }
                socket.send( { type: 'users_list_request' } );

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
        onStatus: function (message) {
            if (message.data.status === 'ok') {
                console.log('ok response', message.data.message);
            } else {
                console.log('error response', message.data.message);
            }
        },
        onNewMessage: function (message) {
            MessageActions.newMessage(message.data);
        },
        onGetUpdatedMessage: function (message) {
            MessageActions.getUpdatedMessage(message.data);
        },
        onHistory: function (message) {
            MessageActions.getHistory(message.data);
        },
        onUsersList: function (message) {
            UsersListActions.resetUsers(message.data);
        },
        onUserFetched: function (message) {
            UserActions.infoFetched(message.data);
        },
        onUserConnected: function (message) {
            UsersListActions.userConnected(message.data);
        },
        onUserDisconnected: function (message) {
            UsersListActions.userDisconnected(message.data);
        },
        onNewUser: function (message) {
            UsersListActions.newUser(message.data);
        },
        onGotPeers: function(message) {
            switch (message.data.channel) {
                case 'video':
                    VideoActions.gotDestPeer(message.data.peers);
                    break;
                case 'file':
                    FileActions.sendDestPeers(message.data.peers);
                    break;
                case 'videoMessage':
                    VideoMessageActions.gotDestPeer(message.data.peers);
                    break;
            }
        }
    },

    sendMoreMessage: function () {
        socket.send({ type: 'upload_message'})
    },

    sendMessage: function (data) {
        socket.send({
            type: 'send_message',
            data: data
        });
    },
    sendUpdatedMessage: function (data) {
        socket.send({
            type: 'send_updated_message',
            data: data
        });
    },
    getDestPeers: function (type) {
        socket.send({
            type: 'peers_request',
            data: {
                channel: type || 'video'
            }
        });
    },
    connectPeer: (peerId) => {
        socket.send({
            type: 'peer_connect',
            data: {
                id: peerId
            }
        })
    }
};

export default model;
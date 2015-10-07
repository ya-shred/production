import SocketAPI from '../utils/socket'

export default {
    sendMessage: function (data) {
        SocketAPI.sendMessage(data);
    },
    sendUpdatedMessage: function (data) {
        SocketAPI.sendUpdatedMessage(data);
    }
};
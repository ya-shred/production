import SocketAPI from '../utils/socket'

export default {
    sendMessage: function (data) {
        SocketAPI.sendMessage(data);
    }
};
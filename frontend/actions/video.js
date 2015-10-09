import AppDispatcher from '../dispatchers/dispatcher';
import Actions from '../constants/video';
import VideoAPI from '../utils/video';
import SocketAPI from '../utils/socket';

export default {
    receiveCall: function (data) {
        AppDispatcher.handlePeerAction({
            actionType: Actions.RECEIVE_CALL,
            data: data
        });
    },
    callToAll: function (data) {
        AppDispatcher.handleViewAction({
            actionType: Actions.GROUP_CALL,
            data: data
        });
    },
    stopCall: function (data) {
        AppDispatcher.handleViewAction({
            actionType: Actions.STOP_CALL,
            data: data
        });
    },
    gotDestPeer: function(data) {
        AppDispatcher.handleViewAction({
            actionType: Actions.DEST_PEERS,
            data: data
        });
    }
};
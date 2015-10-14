import AppDispatcher from '../dispatchers/dispatcher';
import Actions from '../constants/file';

export default {
    sendDestPeers: function(data) {
        AppDispatcher.handleSocketAction({
            actionType: Actions.DEST_PEERS_FILE,
            data: data
        });
    },
    sendFile: function(data) {
        AppDispatcher.handleViewAction({
            actionType: Actions.SEND_FILE,
            data: data
        });
    },
    receiveFile: function(data) {
        AppDispatcher.handlePeerAction({
            actionType: Actions.RECEIVE_FILE,
            data: data
        });
    }
};
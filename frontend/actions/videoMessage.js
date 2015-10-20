import AppDispatcher from '../dispatchers/dispatcher';
import Actions from '../constants/videoMessage';
import VideoAPI from '../utils/video';
import SocketAPI from '../utils/socket';

export default {
    startRecord: function (data) {
        AppDispatcher.handleViewAction({
            actionType: Actions.START_RECORD,
            data: data
        });
    },
    stopRecord: function (data) {
        AppDispatcher.handleViewAction({
            actionType: Actions.STOP_RECORD,
            data: data
        });
    },
    remove: function (data) {
        AppDispatcher.handleViewAction({
            actionType: Actions.REMOVE_RECORD,
            data: data
        });
    },
    send: function (data) {
        AppDispatcher.handleViewAction({
            actionType: Actions.REMOVE_RECORD,
            data: data
        });
    }
};
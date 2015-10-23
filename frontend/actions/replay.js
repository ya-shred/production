import AppDispatcher from '../dispatchers/dispatcher';
import Actions from '../constants/replay';

export default {
    replay: function(data) {
        AppDispatcher.handleViewAction({
            actionType: Actions.REPLAY,
            data: data
        });
    }
};
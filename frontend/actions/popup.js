import AppDispatcher from '../dispatchers/dispatcher';
import Actions from '../constants/popup';

export default {
    showPopup: function(data) {
        AppDispatcher.handleViewAction({
            actionType: Actions.SHOP_POPUP,
            data: data
        });
    },
    closePopup: function(data) {
        AppDispatcher.handleViewAction({
            actionType: Actions.HIDE_POPUP,
            data: data
        });
    }
};
import AppDispatcher from '../dispatchers/dispatcher';
import Actions from '../constants/user';

export default {
    infoFetched(data) {
        AppDispatcher.handleSocketAction({
            actionType: Actions.INFO_FETCHED,
            info: data.user
        });
    },
    newPayment(data) {
        AppDispatcher.handleViewAction({
            actionType: Actions.NEW_PAYMENT,
            data: data
        });
    }
};
import { Dispatcher } from 'flux';
import  assign  from 'react/lib/Object.assign';

var AppDispatcher = assign(new Dispatcher(), {

    handleViewAction: function (action) {
        //console.log('action: ', action);
        this.dispatch({
            source: "VIEW_ACTION",
            action: action
        })
    },

	handleSocketAction: function (action) {
		//console.log('socket action: ', action);
		this.dispatch({
			source: "SOCKET_ACTION",
			action: action
		})
	},

	handlePeerAction: function (action) {
		//console.log('socket action: ', action);
		this.dispatch({
			source: "PEER_ACTION",
			action: action
		})
	}
});

export default AppDispatcher;

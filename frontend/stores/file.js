import Actions from '../constants/video';
import SocketAPI from '../utils/socket';
import FileAPI from '../utils/file';
import AppDispatcher from '../dispatchers/dispatcher';
import assign  from 'react/lib/Object.assign';
import BaseStore from './base';

let files = [];

const store = assign({}, BaseStore, {
    sendDestPeers: (peers) => {
        let oldFiles = files.slice();
        FileAPI.sending(peers, oldFiles);
        files.length = 0;
        oldFiles.forEach((file) => {
            store.receiveFile(file);
        });
    },

    receiveFile: (file) => {
        debugger;
        console.log(file);
    },

    addFile: (file) => {
        if (files.indexOf(file) === -1) {
            files.push(file);
        }
    },

    dispatcherIndex: AppDispatcher.register(function (payload) {

        var action = payload.action;

        switch (action.actionType) {
            case Actions.DEST_PEERS_FILE:
                store.sendDestPeers(action.data);
                break;
            case Actions.SEND_FILE:
                SocketAPI.getDestPeers('file');
                store.addFile(action.data);
                break;
            case Actions.RECEIVE_FILE:
                store.receiveFile(action.data);
                break;
        }

        return true;
    })

});

module.exports = store;
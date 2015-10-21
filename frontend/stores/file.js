import Actions from '../constants/file';
import SocketAPI from '../utils/socket';
import FileAPI from '../utils/file';
import UserStore from './user';
import AppDispatcher from '../dispatchers/dispatcher';
import assign  from 'react/lib/Object.assign';
import BaseStore from './base';

let files = [];
let oldFiles = [];

const store = assign({}, BaseStore, {
    sendDestPeers: (peers) => {
        oldFiles = files.slice();
        FileAPI.sending(peers, oldFiles);
        files.length = 0;
    },

    getOldFiles: () => {
        return oldFiles;
    },

    addFile: (file) => {
        if (files.indexOf(file) === -1) {
            files.push({
                type: 'simple_file',
                id: UserStore.getUserInfo().id + +new Date(),
                channel: 'general',
                datetime: +new Date(),
                userId: UserStore.getUserInfo().id,
                additional: {
                    file: file,
                    mime: file.type,
                    name: file.name
                }
            });
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
        }

        return true;
    })

});

module.exports = store;
import Actions from '../constants/video';
import VideoAPI from '../utils/video';
import SocketAPI from '../utils/socket';
import AppDispatcher from '../dispatchers/dispatcher';
import assign  from 'react/lib/Object.assign';
import BaseStore from './base';

let streams = [];
let activeCalls = [];
let state = '';

const store = assign({}, BaseStore, {
    answerCall: (callObj) => {
        let answer = (callObj, userStream) => {
            activeCalls.push(callObj);
            callObj.answer(userStream);
            store.bindCallObj(callObj);
        };

        if (streams.length) {
            answer(callObj, streams[0]);
        } else {
            return store.getUserStream()
                .then((userStream) => {
                    userStream && store.addUserStream(userStream);
                    answer(callObj, userStream);
                });
        }
    },

    addUserStream: (stream) => {
        stream.isSelf = true;
        store.addStream(stream);
    },

    addStream: (stream) => {
        return streams.push(stream);
    },

    removeStream: (stream) => {
        let ind = streams.indexOf(stream);
        ind !== -1 && store.disconnectStream(streams.splice(ind, 1)[0]);
        store.removeLast();
    },

    removeLast: () => {
        if (streams.length === 1) {
            store.disconnectStream(streams[0]);
            streams.length = 0;
            state = '';
        }
    },

    disconnectStream: (stream) => {
        stream.getTracks().forEach((track) => {
            track.stop();
        });
    },

    clearStreams: () => {
        streams.forEach((stream, ind) => {
            store.removeStream(stream, ind);
        });
    },

    closeCalls: () => {
        activeCalls.forEach((call) => {
            call.close();
        });
    },

    stopCall: () => {
        store.removeLast();
        store.closeCalls();
    },

    getUserStream: () => {
        return VideoAPI.getUserMedia()
            .catch(() => {
            });
    },

    addSelfStream: () => {
        return VideoAPI.getUserMedia()
            .then((stream) => {
                store.addUserStream(stream);
                store.emitChange();
            });
    },

    bindCallObj: (callObj) => {
        callObj.on('stream', (stream) => {
            callObj.stream = stream;
            store.addStream(stream);
            store.emitChange();
        });

        callObj.on('close', () => {
            store.removeStream(callObj.stream);
            callObj.close();
            let ind = activeCalls.indexOf(callObj);
            activeCalls.splice(ind, 1);
            store.emitChange();
        });
    },

    addDestPeers: (peers) => {
        activeCalls = VideoAPI.calling(peers, streams[0]);
        activeCalls.forEach((callObj) => {
            callObj && store.bindCallObj(callObj);
        });
    },

    getAllStreams: () => {
        return streams;
    },

    dispatcherIndex: AppDispatcher.register(function (payload) {

        var action = payload.action;

        switch (action.actionType) {
            case Actions.RECEIVE_CALL:
                if (state === '') {
                    state = 'receive call';
                    let callObj = action.data;
                    store.answerCall(callObj);
                }
                break;
            case Actions.GROUP_CALL:
                if (state === '') {
                    state = 'start call';
                    store.addSelfStream()
                        .then(() => SocketAPI.getDestPeers('video'));
                }
                break;
            case Actions.DEST_PEERS:
                store.addDestPeers(action.data);
                break;
            case Actions.STOP_CALL:
                store.stopCall();
                break;
        }

        return true;
    })

});

module.exports = store;
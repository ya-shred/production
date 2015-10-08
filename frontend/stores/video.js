import Actions from '../constants/video';
import VideoAPI from '../utils/video';
import SocketAPI from '../utils/socket';
import AppDispatcher from '../dispatchers/dispatcher';
import assign  from 'react/lib/Object.assign';
import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';

let streams = [];
let activeCalls = [];
let state = '';

const store = assign({}, EventEmitter.prototype, {
    answerCall: (callObj) => {
        var stream = null;
        var ind = 0;

        return store.getUserStream()
            .then((userStream) => {
                !streams.length && store.addStream(userStream);

                callObj.answer(userStream);

                callObj.on('stream', (st) => {
                    stream = st;
                    ind = store.addStream(stream) - 1;
                    store.emitChange();
                });

                callObj.on('close', () => {
                    store.removeStream(stream, ind);
                    store.emitChange();
                });
            })
    },

    addStream: (stream) => {
        return streams.push(stream);
    },

    removeStream: (stream, ind) => {
        store.disconnectStream(streams.splice(ind, 1)[0]);
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
        //store.clearStreams();
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
                store.addStream(stream);
                store.emitChange();
            });
    },

    addDestPeers: (peers) => {
        activeCalls = VideoAPI.calling(peers, streams[0]);
        activeCalls.forEach((callObj) => {
            let stream = null;
            let ind = 0;

            callObj.on('stream', (st) => {
                stream = st;
                ind = store.addStream(stream) - 1;
                store.emitChange();
            });

            callObj.on('close', () => {
                store.removeStream(stream, ind);
                store.emitChange();
            });
        });
    },

    getAllStreams: () => {
        return streams;
    },

    emitChange: () => {
        store.emit(CHANGE_EVENT);
    },

    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback)
    },

    removeChangeListener: function (callback) {
        this.removeChangeListener(CHANGE_EVENT, callback);
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
                        .then(SocketAPI.getDestPeers);
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
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
        var stream = null;

        return store.getUserStream()
            .then((userStream) => {
                !streams.length && userStream && store.addUserStream(userStream);
                activeCalls.push(callObj);

                callObj.answer(userStream);

                callObj.on('stream', (st) => {
                    stream = st;
                    store.addStream(stream);
                    store.emitChange();
                });

                callObj.on('close', () => {
                    store.removeStream(stream);
                    store.emitChange();
                });
            })
    },

    addUserStream: (stream) => {
        var cloned = stream.clone();
        cloned.getAudioTracks().forEach((track) => track.stop());
        store.addStream(cloned);
    },

    addStream: (stream) => {
        return streams.push(stream);
    },

    removeStream: (stream) => {
        let ind = streams.indexOf(stream);
        ind !== -1 && store.disconnectStream(streams.splice(ind, 1)[0]);
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
                store.addUserStream(stream);
                store.emitChange();
            });
    },

    addDestPeers: (peers) => {
        activeCalls = VideoAPI.calling(peers, streams[0]);
        activeCalls.forEach((callObj) => {
            let stream = null;

            callObj.on('stream', (st) => {
                stream = st;
                store.addStream(stream);
                store.emitChange();
            });

            callObj.on('close', () => {
                store.removeStream(stream);
                store.emitChange();
            });
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
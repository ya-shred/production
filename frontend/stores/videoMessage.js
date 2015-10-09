import Actions from '../constants/videoMessage';
import VideoAPI from '../utils/video';
import SocketAPI from '../utils/socket';
import AppDispatcher from '../dispatchers/dispatcher';
import assign  from 'react/lib/Object.assign';
import BaseStore from './base';
//import VideoRecorder from 'video-recorder';

let messages = [];
let curMessage = null;
let curMessageStream = null;
let state = '';
let record = null;

const store = assign({}, BaseStore, {
    //answerCall: (callObj) => {
    //    var stream = null;
    //
    //    return store.getUserStream()
    //        .then((userStream) => {
    //            !streams.length && userStream && store.addStream(userStream);
    //            activeCalls.push(callObj);
    //
    //            callObj.answer(userStream);
    //
    //            callObj.on('stream', (st) => {
    //                stream = st;
    //                store.addStream(stream);
    //                store.emitChange();
    //            });
    //
    //            callObj.on('close', () => {
    //                store.removeStream(stream);
    //                store.emitChange();
    //            });
    //        })
    //},
    //
    //addStream: (stream) => {
    //    return streams.push(stream);
    //},
    //
    //removeStream: (stream) => {
    //    let ind = streams.indexOf(stream);
    //    ind !== -1 && store.disconnectStream(streams.splice(ind, 1)[0]);
    //    if (streams.length === 1) {
    //        store.disconnectStream(streams[0]);
    //        streams.length = 0;
    //        state = '';
    //    }
    //},
    //
    //
    //clearStreams: () => {
    //    streams.forEach((stream, ind) => {
    //        store.removeStream(stream, ind);
    //    });
    //},
    //
    //closeCalls: () => {
    //    activeCalls.forEach((call) => {
    //        call.close();
    //    });
    //},
    //
    //stopCall: () => {
    //    //store.clearStreams();
    //    store.closeCalls();
    //},
    //
    //getUserStream: () => {
    //    return VideoAPI.getUserMedia()
    //        .catch(() => {
    //        });
    //},
    //
    //addSelfStream: () => {
    //    return VideoAPI.getUserMedia()
    //        .then((stream) => {
    //            store.addStream(stream);
    //            store.emitChange();
    //        });
    //},
    //
    //addDestPeers: (peers) => {
    //    activeCalls = VideoAPI.calling(peers, streams[0]);
    //    activeCalls.forEach((callObj) => {
    //        let stream = null;
    //
    //        callObj.on('stream', (st) => {
    //            stream = st;
    //            store.addStream(stream);
    //            store.emitChange();
    //        });
    //
    //        callObj.on('close', () => {
    //            store.removeStream(stream);
    //            store.emitChange();
    //        });
    //    });
    //},
    disconnectStream: (stream) => {
        stream.getTracks().forEach((track) => {
            track.stop();
        });
    },

    startRecord: () => {
        return VideoAPI.getUserMedia()
            .then((stream) => {
                curMessageStream = stream;
                record = RecordRTC(stream, {recorderType: WhammyRecorder });
                record.startRecording();
                store.emitChange();
            });

    },

    stopRecord: () => {
        let recordObj = record;
        store.disconnectStream(curMessageStream);
        recordObj.stopRecording(function () {
            curMessage = recordObj.getBlob();
            curMessageStream = null;
            store.emitChange();
        });
    },

    removeRecord: () => {
        curMessage = null;
        store.emitChange();
    },

    getAllMessages: () => {
        return messages;
    },

    getCurMessage: () => {
        return curMessage;
    },

    getCurMessageStream: () => {
        return curMessageStream;
    },

    dispatcherIndex: AppDispatcher.register(function (payload) {

        var action = payload.action;

        switch (action.actionType) {
            case Actions.START_RECORD:
                if (state === '') {
                    state = 'start record';
                    store.startRecord();
                }
                break;
            case Actions.STOP_RECORD:
                state = '';
                store.stopRecord();
                break;
            case Actions.REMOVE_RECORD:
                store.removeRecord();
                break;
        }

        return true;
    })

});

module.exports = store;
import Actions from '../constants/videoMessage';
import VideoAPI from '../utils/video';
import SocketAPI from '../utils/socket';
import AppDispatcher from '../dispatchers/dispatcher';
import assign  from 'react/lib/Object.assign';
import BaseStore from './base';
import RecordRTC from 'recordrtc';

let curMessage = null;
let curMessageStream = null;
let currentMessageStreamRecords = [];
let state = '';
let record = null;

const store = assign({}, BaseStore, {
    disconnectStream: (stream) => {
        stream.getTracks().forEach((track) => {
            track.stop();
        });
    },

    startRecord: () => {
        curMessage = null;
        return VideoAPI.getUserMedia()
            .then((stream) => {
                curMessageStream = stream;
                let mimeType = 'video/webm';
                currentMessageStreamRecords = [];
                let bufferSize = 16384;

                let audioRecorder = RecordRTC(stream, {
                    type: 'audio',
                    bufferSize: bufferSize,
                    simpleRate: 44100,
                    disableLogs: true
                });

                let videoRecorder = RecordRTC(stream, {
                    type: 'video',
                    disableLogs: true,
                    canvas: {
                        width: 1024,
                        height: 768
                    },
                    frameInterval: 20
                });

                videoRecorder.initRecorder(() => {
                    audioRecorder.initRecorder(() => {
                        audioRecorder.startRecording();
                        videoRecorder.startRecording();
                    })
                });

                currentMessageStreamRecords.push(audioRecorder, videoRecorder);

                store.emitChange();
            });

    },

    stopRecord: () => {
        let recordObj = record;
        store.disconnectStream(curMessageStream);
        currentMessageStreamRecords[0].stopRecording((audioURL) => {
            currentMessageStreamRecords[1].stopRecording((videoURL) => {
                curMessageStream = null;
                curMessage = [audioURL, videoURL];
                store.emitChange();
            });
        });
    },

    removeRecord: () => {
        curMessage = null;
        store.emitChange();
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
                store.startRecord();
                break;
            case Actions.STOP_RECORD:
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
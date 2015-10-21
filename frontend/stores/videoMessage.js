import Actions from '../constants/videoMessage';
import VideoAPI from '../utils/video';
import SocketAPI from '../utils/socket';
import FileAPI from '../utils/file';
import AppDispatcher from '../dispatchers/dispatcher';
import assign  from 'react/lib/Object.assign';
import BaseStore from './base';
import UserStore from './user';
import RecordRTC from 'recordrtc';

let curMessage = null;
let curMessageBlob = null;
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
                curMessageBlob = [currentMessageStreamRecords[0].getBlob(), currentMessageStreamRecords[1].getBlob()];
                store.emitChange();
            });
        });
    },

    removeRecord: () => {
        curMessage = null;
        store.emitChange();
    },

    sendRecord: (peers) => {
        if (curMessageBlob) {
            FileAPI.sending(peers, [{
                type: 'video_message',
                id: UserStore.getUserInfo().id + +new Date(),
                channel: 'general',
                datetime: +new Date(),
                userId: UserStore.getUserInfo().id,
                additional: {
                    audio: curMessageBlob[0],
                    audioMime: curMessageBlob[0].mime,
                    video: curMessageBlob[1],
                    videoMime: curMessageBlob[1].mime
                }
            }]);
            curMessageBlob = null;
        }
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
            case Actions.SEND_RECORD:
                SocketAPI.getDestPeers('videoMessage');
                store.removeRecord();
                break;
            case Actions.DEST_PEERS_VIDEOMESSAGE:
                store.sendRecord(action.data);
                break;
        }

        return true;
    })

});

module.exports = store;
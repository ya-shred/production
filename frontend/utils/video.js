import Peer from './peer';
import VideoAction from '../actions/video';

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

var model = {
    init: () => {
        return model.inited = Peer.init().then(() => {
            model.listen();
        });
    },

    listen: () => {
        Peer.getPeer().on('call', (call) => {
            console.log('someone call', call);
            VideoAction.receiveCall(call);
        });
    },

    getUserMedia: () => {
        return new Promise(function (resolve, reject) {
            navigator.getUserMedia({video: true, audio: true},
                function (stream) {
                    resolve(stream);
                },
                function (err) {
                    reject(err);
                    console.log("The following error occured: " + err.name);
                }
            );
        });
    },

    calling: (peers, mediaStream) => {
        if (!model.inited) {
            console.log('Peer not inited, cannot call');
            return [];
        }
        let peerObj = Peer.getPeer();
        let calls = [];
        peers.forEach((peer) => {
            if (peer !== Peer.getId()) {
                calls.push(peerObj.call(peer, mediaStream));
            }
        });
        return calls;
    }
};

export default model;
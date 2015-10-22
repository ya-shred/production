import Peer from './peer';
import VideoAction from '../actions/video';

window.navigator.getUserMedia = window.navigator.getUserMedia ||
    window.navigator.webkitGetUserMedia ||
    window.navigator.mozGetUserMedia;

var model = {
    init: () => {
        return model.inited = Peer.inited.then(() => {
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
            window.navigator.getUserMedia({video: true, audio: true},
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
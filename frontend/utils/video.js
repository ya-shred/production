import Peer from 'peerjs'
import SocketAPI from './socket'
import VideoAction from '../actions/video'

var key = 'ugzzgfk803cba9k9';
var peerId = null;
var peerObj = null;

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

var model = {
    init: (() => {
        return new Promise(function (resolve, reject) {
            var peer = new Peer({key: key});
            peer.on('open', (id) => {
                SocketAPI.connectPeer(id);
                peerId = id;
                peerObj = peer;
                resolve(id);
                console.log('My peer ID is: ' + id);
                model.listen();
            });
        });
    })(),

    listen: () => {
        peerObj.on('call', (call) => {
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
        var calls = [];
        peers.forEach((peer) => {
            calls.push(peerObj.call(peer, mediaStream));
        });
        return calls;
    }
};

export default model;
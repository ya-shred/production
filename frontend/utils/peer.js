import Peer from 'peerjs'
import SocketAPI from './socket'

var peerId = null;
var peerObj = null;

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

let model = {
    inited: null,
    init: () => {
        if (!model.inited) {
            model.inited = new Promise((resolve, reject) => {
                var peer = new Peer({
                    port: 443,
                    key: 'peerjs',
                    host: 'shri-peer.herokuapp.com',
                    secure: true
                });
                peer.on('open', (id) => {
                    SocketAPI.connectPeer(id);
                    peerId = id;
                    peerObj = peer;
                    resolve(id);
                    console.log('My peer ID is: ' + id);
                });
            });
        }
        return model.inited;
    },
    getPeer: () => {
        return peerObj;
    },
    getId: () => {
        return peerId;
    }

};

export default model;
import Peer from 'peerjs'
import UserStore from '../stores/user.js'
import SocketAPI from './socket'

var key = 'ugzzgfk803cba9k9';

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

var model = {
    init: (() => {
        return new Promise(function (resolve, reject) {
            var peer = new Peer({key: 'ugzzgfk803cba9k9'});
            peer.on('open', (id) => {
                SocketAPI.connectPeer(id);
                model.peerId = id;
                model.peer = peer;
                resolve(id);
                console.log('My peer ID is: ' + id);
            });
        });
    })(),

    listen: ($video) => {
        model.peer.on('call', (call) => {
            console.log('someone call', call);
            var stream = null;
            // Answer the call, providing our mediaStream
            call.answer();

            call.on('stream', (st) => {
                stream = st;
                model.connectVideoToStream($video, st);
            });

            call.on('close', () => {
                model.disconnectVideo($video);
            });
        });
    },

    connectVideoToStream: ($video, stream) => {
        $video.src = window.URL.createObjectURL(stream);
        $video.onloadedmetadata = function (e) {
            $video.play();
        };
    },

    disconnectVideo: ($video) => {
        $video.src = '';
    },

    peerId: null,

    status: '',
    your_video: null,

    connect: ($video) => {
        return model.init
            .then(() => {
                model.status = 'connect init';
                model.your_video = $video;
                model.getDestPeer();

                //    return Promise.all([
                //        model.getDestPeer(),
                //        model.getUserMedia()
                //    ])
                //})
                //.then(([destPeer, mediaStream]) => {
                //    model.calling(destPeer, mediaStream, $video);
            })
    },

    getDestPeer: () => {
        model.status = 'require peers';
        SocketAPI.getDestPeers();
    },

    gotDestPeer: (peers) => {
        if (model.status === 'require peers' && model.your_video) {
            model.status = 'got peers';
            return model.getUserMedia()
                .then((stream) => {
                    model.calling(peers, stream, model.your_video);
                })
        }
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

    calls: [],
    stream: null,

    calling: (peers, mediaStream, $video) => {
        model.connectVideoToStream($video, mediaStream);
        model.stream = mediaStream;
        var calls = model.calls = [];
        // Call a peer, providing our mediaStream
        peers.forEach((peer) => {
            calls.push(model.peer.call(peer, mediaStream));
        })
    },

    stopCall: () => {
        model.calls.forEach((call) => {
            call.close();
        });
        model.stream.getTracks().forEach((track) => {
            track.stop();
        });
        model.disconnectVideo(model.your_video);
    }
};

export default model;
import Peer from './peer';
import FileAction from '../actions/file';

var model = {
    init: () => {
        return model.inited = Peer.init().then(() => {
            model.listen();
        });
    },

    listen: () => {
        Peer.getPeer().on('connection', (conn) => {
            conn.on('data', (data) => {
                console.log('someone send file', data);
                FileAction.receiveFile(data);
            });
        });
    },

    sending: (peers, files) => {
        if (!model.inited) {
            console.log('Peer not inited, cannot send');
            return null;
        }

        let peerObj = Peer.getPeer();

        peers.forEach((peer) => {
            if (peer !== Peer.getId()) {
                let conn = peerObj.connect(peer);
                conn && conn.on('open', () => {
                    files.forEach((file) => {
                        conn.send(file);
                    });
                });
            }
        });
    }
};

export default model;
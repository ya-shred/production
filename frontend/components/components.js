import React from 'react';
import Header from './header';
import DropZone from './dropZone';
import Popup from './popup';
import ContainerChat from './containerChat';
import SocketAPI from '../utils/socket';
import VideoAPI from '../utils/video';
import FileAPI from '../utils/file';
import PeerAPI from '../utils/peer';
import FileStore from '../stores/file';
import FileAction from '../actions/file';

export default class Components extends React.Component {
    constructor() {
        super();
        this.state = {drop: false};
        this.dragLeaveCount = 0;
        this.dragEnterCount = 0;
    }

    componentWillMount() {
        PeerAPI.init();
        SocketAPI.init();
        VideoAPI.init();
        FileAPI.init();
    }

    dragleave = (e) => {
        //console.log('drag leave');
        this.dragLeaveCount++;
        if (this.dragLeaveCount === this.dragEnterCount) {
            this.setState({drop: false});
        }
        e.stopPropagation();
        e.preventDefault();
    };

    dragenter = (e) => {
        //console.log('drag enter');
        this.dragEnterCount++;
        this.setState({drop: true});
        e.stopPropagation();
        e.preventDefault();
    };

    dragover = (e) => {
        //console.log('drag over');
        e.stopPropagation();
        e.preventDefault();
    };

    drop = (e) => {
        //console.log('drop');
        e.stopPropagation();
        e.preventDefault();
        this.dragEnterCount = 0;
        this.dragLeaveCount = 0;
        this.setState({drop: false});
        var file = e.dataTransfer.files[0];
        file && this.sendFile(file);
    };

    sendFile(file) {
        FileAction.sendFile(file);
    }

    render() {
        return (
            <div>
                <div onDragEnter={this.dragenter}
                     onDragOver={this.dragover}
                     onDrop={this.drop}
                     onDragLeave={this.dragleave}>
                    {this.state.drop && (<DropZone />)}
                    <Header/>
                    <ContainerChat/>
                </div>
                <Popup/>
            </div>
        );
    }
}

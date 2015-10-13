import React from 'react';
import '../app-styles/app.styl';
import Header from './header';
import ContainerChat from './containerChat';
import SocketAPI from '../utils/socket';
import VideoAPI from '../utils/video';

export default class Components extends React.Component {

    componentWillMount() {
        SocketAPI.init();
        VideoAPI.init();
    }

    render() {
        return (
            <div>
                <Header/>
                <ContainerChat/>
            </div>
        );
    }
}

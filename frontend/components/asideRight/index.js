import React from 'react';
import './index.styl';
import VideoCall from '../video';

class AsideRight extends React.Component {

    render() {
        return <aside className="aside-right aside-left">
            <VideoCall />
            <img src="http://i10.fotocdn.net/s1/1/gallery_m/1044/1044393/1044393492.jpg"/>
        </aside>

    }
}

export default AsideRight;
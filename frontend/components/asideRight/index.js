import React from 'react';
import './index.styl';
import VideoCall from '../video';

class AsideRight extends React.Component {

    render() {
        return <aside className="aside-right aside-left">
            <VideoCall />
        </aside>

    }
}

export default AsideRight;
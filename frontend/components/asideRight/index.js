import React from 'react';
import VideoCall from '../video';
import VideoMessageList from '../videoMessage';

class AsideRight extends React.Component {

    render() {
        return <aside className="aside-right aside-left" ref="bar"  >
            <div className="aside-right__content">
                <VideoCall />
                <VideoMessageList />
            </div>
        </aside>

    }
}

export default AsideRight;
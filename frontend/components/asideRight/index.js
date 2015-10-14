import React from 'react';
import VideoCall from '../video';

class AsideRight extends React.Component {


    render() {
        return <aside className="aside-right aside-left" ref="bar"  >
            <div className="aside-right__content">
                <VideoCall />
            </div>
        </aside>

    }
}

export default AsideRight;
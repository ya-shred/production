import React from 'react';
import './index.styl';
import Video from '../../utils/video'

export default class VideoCall extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        Video.init
            .then(() => {
                return Video.listen(this.refs.video_other.getDOMNode())
            });
    }

    call = () => {
        Video.connect(this.refs.video_you.getDOMNode());
    }

    stopCall = () => {
        Video.stopCall();
    }

    render() {
        return (
            <div className='video'>
                <video className='video__out' ref='video_you' />
                <video className='video__out' ref='video_other' />
                <button className='video__call' onClick={this.call} >
                    Позвонить
                </button>
                <button className='video__call' onClick={this.stopCall} >
                    Завершить разговор
                </button>
            </div>
        )

    }
};
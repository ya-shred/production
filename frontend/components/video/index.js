import React from 'react';
import VideoStore from '../../stores/video'
import VideoAction from '../../actions/video'

let getStreams = () => {
    return {videos: VideoStore.getAllStreams()};
};

export default class VideoCall extends React.Component {
    constructor() {
        super();
        this.state = getStreams();
    }

    componentDidMount() {
        VideoStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        VideoStore.removeChangeListener(this.onChange);
    }

    componentDidUpdate() {
        let _this = this;
        this.state.videos.forEach((video) => {
            var $video = _this.refs['video_' + video.id].getDOMNode();
            _this.bindStream($video, video);
        });
    }

    bindStream (video, stream) {
        video.src = window.URL.createObjectURL(stream);
        video.onloadedmetadata = function (e) {
            video.play();
        };
    }

    onChange = () => {
        var streams = getStreams();
        this.setState(streams);
        this.setState({callDisabled: !!streams.videos.length});
    };

    call = () => {
        this.setState({callDisabled: true});
        VideoAction.callToAll();
    };

    stopCall = () =>  {
        this.setState({callDisabled: false});
        VideoAction.stopCall();
    };

    render() {
        let videos = this.state.videos.map((video) => {
            return (
                <video className='video__out' ref={'video_' + video.id} key={video.id} />
            )
        });

        return (
            <div className='video'>
                {videos}
                <button className='video__call' ref='call' onClick={this.call} disabled={this.state.callDisabled}>
                    Позвонить
                </button>
                <button className='video__call' ref='stopCall' onClick={this.stopCall} disabled={!this.state.callDisabled}>
                    Завершить разговор
                </button>
            </div>
        )

    }
};
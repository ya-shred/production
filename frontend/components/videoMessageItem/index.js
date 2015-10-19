import React from 'react';
import './index.styl';
import VideoMessageStore from '../../stores/videoMessage'
import VideoMessageAction from '../../actions/videoMessage'

let getStreams = () => {
    return {messages: VideoMessageStore.getAllMessages()};
};

export default class VideoMessage extends React.Component {
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

    bindStream = (video, stream) => {
        video.src = window.URL.createObjectURL(stream);
        video.onloadedmetadata = function (e) {
            video.play();
        };
    }

    onChange = () => {
        var streams = getStreams();
        this.setState(streams);
        this.setState({callDisabled: !!streams.videos.length});
    }

    call = () => {
        this.setState({callDisabled: true});
        VideoAction.callToAll();
    }

    stopCall = () => {
        this.setState({callDisabled: false});
        VideoAction.stopCall();
    }

    render() {
        let messages = this.state.messages.map((message) => {
            return (
                <video className='video__out' ref={'video_' + message.id} key={message.id} />
            )
        });

        return (
            <div className='video'>
                <button className='video__call' onClick={this.call} disabled={this.state.callDisabled}>
                    Позвонить
                </button>
                <button className='video__call' onClick={this.stopCall} disabled={!this.state.callDisabled}>
                    Завершить разговор
                </button>
                {messages}
            </div>
        )

    }
};
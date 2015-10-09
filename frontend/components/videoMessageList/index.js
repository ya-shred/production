import React from 'react';
import './index.styl';
import VideoMessageStore from '../../stores/videoMessage'
import VideoMessageAction from '../../actions/videoMessage'
//import VideoMessageItem from '../videoMessageItem'

let getMessages = () => {
    return {messages: VideoMessageStore.getAllMessages()};
};

let getCurMessage = () => {
    return VideoMessageStore.getCurMessage();
};

let getCurMessageStream = () => {
    return VideoMessageStore.getCurMessageStream();
};

export default class VideoMessage extends React.Component {
    constructor() {
        super();
        this.state = getMessages();
        this.state.isRecording = false;
        this.state.curMessage = getCurMessage();
        this.state.curMessageStream = getCurMessageStream();
    }

    componentDidMount() {
        VideoMessageStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        VideoMessageStore.removeChangeListener(this.onChange);
    }

    componentDidUpdate() {
        let stream;
        let video = this.refs.self_video.getDOMNode();
        if (stream = this.state.curMessageStream) {
            this.bindStream(video, stream);
        } else if (stream = this.state.curMessage) {
            this.bindVideo(video, stream);
        }
    }

    bindStream = (video, stream) => {
        video.src = window.URL.createObjectURL(stream);
        video.controls = false;
        video.onloadedmetadata = function (e) {
            video.play();
        };
    }

    bindVideo = (video, stream) => {
        video.src = window.URL.createObjectURL(stream);
        video.controls = true;
    }

    onChange = () => {
        this.setState(getMessages());
        this.setState({curMessage: getCurMessage()});
        this.setState({curMessageStream: getCurMessageStream()});
    }

    record = () => {
        this.setState({isRecording: true});
        VideoMessageAction.startRecord();
    }

    stopRecord = () => {
        this.setState({isRecording: false});
        VideoMessageAction.stopRecord();
    }

    del = () => {
        VideoMessageAction.remove();
    }

    render() {
        let messages = '';
        //this.state.messages.map((message) => {
        //    return (
        //        <VideoMessageItem message={message} />
        //    )
        //});

        return (
            <div className='video'>
                <video className='video__out' ref='self_video' />
                <button className='video__call' onClick={this.record} disabled={this.state.isRecording}>
                    Начать запись
                </button>
                <button className='video__call' onClick={this.stopRecord} disabled={!this.state.isRecording}>
                    Окончить запись
                </button>
                <button className='video__call' onClick={this.del} disabled={!this.state.curMessage}>
                    Удалить
                </button>
                <button className='video__call' onClick={this.send} disabled={!this.state.curMessage}>
                    Отправить
                </button>
                <div className='video-message__list'>
                    {messages}
                </div>
            </div>
        )

    }
};
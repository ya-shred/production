import React from 'react';
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

        return (
            <div className='video'>
                <video className='video__out' ref='self_video' />
                <div
                    className='video__button_record video__button'
                    onClick={this.record}
                    disabled={this.state.isRecording}
                    title="Начать запись">
                </div>
                <div
                    className='video__button_stop-record video__button'
                    onClick={this.stopRecord}
                    disabled={!this.state.isRecording}
                    title="Окончить запись">
                </div>
                <div
                    className='video__button_remove video__button'
                    onClick={this.del}
                    disabled={!this.state.curMessage}
                    title="Удалить">
                </div>
                <div
                    className='video__button_send video__button'
                    onClick={this.send}
                    disabled={!this.state.curMessage}
                    title="Отправить всем">
                </div>
            </div>
        )

    }
};
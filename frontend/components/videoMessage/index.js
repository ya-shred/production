import React from 'react';
import VideoMessageStore from '../../stores/videoMessage'
import VideoMessageAction from '../../actions/videoMessage'

let getCurMessage = () => {
    return VideoMessageStore.getCurMessage();
};

let getCurMessageStream = () => {
    return VideoMessageStore.getCurMessageStream();
};

let getCurState = () => {
    return {
        curMessage: getCurMessage(),
        curMessageStream: getCurMessageStream()
    }
};

export default class VideoMessage extends React.Component {
    constructor() {
        super();
        this.state = getCurState();
        this.state.isRecording = false;
        this.state.hasRecord = false;
    }

    componentDidMount() {
        VideoMessageStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        VideoMessageStore.removeChangeListener(this.onChange);
    }

    componentDidUpdate() {
        this.updateAudioVideo();
    }

    updateAudioVideo = () => {
        let stream;
        let video = this.refs.self_video.getDOMNode();
        let audio = this.refs.self_audio.getDOMNode();
        if (stream = this.state.curMessageStream) {
            this.bindStream(video, stream);
        } else if (stream = this.state.curMessage) {
            this.bindAudioVideo(audio, video, stream[0], stream[1]);
        } else {
            this.unbindAudioVideo(audio, video);
        }
    };

    unbindAudioVideo = (audio, video) => {
        audio.src = '';
        video.src = '';
        video.controls = false;
    };

    bindStream = (video, stream) => {
        video.src = window.URL.createObjectURL(stream);
        video.controls = false;
        video.onloadedmetadata = function (e) {
            video.play();
        };
    };

    bindAudioVideo = (audio, video, streamAudio, streamVideo) => {
        video.src = streamVideo;
        video.controls = true;
        audio.src = streamAudio;
        video.onplay = () => {
            audio.currentTime = video.currentTime;
            audio.play();
        };
        video.onpause = () => {
            audio.pause();
        };
        video.onseeking = () => {
            audio.currentTime = video.currentTime;
        };
        video.onseeked = () => {
            audio.currentTime = video.currentTime;
        };
        video.play();
    };

    onChange = () => {
        let state = getCurState();
        state.hasRecord = !!state.curMessage;
        this.setState(state);
    };

    record = () => {
        this.setState({isRecording: true});
        VideoMessageAction.startRecord();
    };

    stopRecord = () => {
        this.setState({isRecording: false});
        VideoMessageAction.stopRecord();
    };

    del = () => {
        this.setState({hasRecord: false});
        VideoMessageAction.remove();
    };

    send = () => {
        VideoMessageAction.send();
    };

    render() {

        return (
            <div className='video'>
                <video className='video__out' ref='self_video'/>
                <audio className='audio__out hide' ref='self_audio'/>
                <button
                    className='video__button_record video__button'
                    onClick={this.record}
                    disabled={this.state.isRecording}
                    title="Начать запись">
                </button>
                <button
                    className='video__button_stop-record video__button'
                    onClick={this.stopRecord}
                    disabled={!this.state.isRecording}
                    title="Окончить запись">
                </button>
                <button
                    className='video__button_remove video__button'
                    onClick={this.del}
                    disabled={!this.state.hasRecord}
                    title="Удалить">
                </button>
                <button
                    className='video__button_send video__button'
                    onClick={this.send}
                    disabled={!this.state.hasRecord}
                    title="Отправить всем">
                </button>
            </div>
        )

    }
};
import React from 'react';

export default class VideoAudio extends React.Component {

    constructor() {
        super();
    }

    componentDidMount() {
        let video = this.refs['message-video'].getDOMNode();
        let audio = this.refs['message-audio'].getDOMNode();
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
    }

    render() {
        return (
            <div className="message-video-audio">
                <div>Пользователь прислал вам видеосообщение:</div>
                <video ref="message-video" src={this.props.video} controls className="message-video-audio__video"/>
                <audio ref="message-audio" src={this.props.audio}/>
            </div>
        );

    }

}
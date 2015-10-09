import React from 'react';
import Textarea from '../textarea';
import MessageStore from '../../stores/message.js';
import MessageList from "../messageList";
import './index.styl';

var getMessages = () => {
    return MessageStore.getAllMessages();
};

export default class ChatWindowMessage extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: getMessages()
        }
    }

    componentDidMount() {
        MessageStore.addChangeListener(this.onChange);
    }

    onChange = () => {
        this.setState(getMessages());
    }

    componentWillUnmount() {
        MessageStore.removeChangeListener(this.onChange);
    }

    render() {

        return <section className="chat-window">

            <div className="chat-window__content">
                <MessageList messages={ this.state.messages }/>
            </div>

            <div className="chat-window__box-send-message">
                <Textarea/>
            </div>

        </section>
    }

};
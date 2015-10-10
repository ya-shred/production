import React from 'react';
import './index.styl';
import MessageItem from "../messageItem";
import _ from 'lodash';
export default class MessageList extends React.Component {

    constructor() {
        super();
        this.onScroll = _.throttle(function(e) {
            if (e.target === null) {
                debugger;
            }
        }, 500);
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom = () => {
        var messageList = this.refs.messageList.getDOMNode();
        messageList.scrollTop = messageList.scrollHeight;
    };

    render() {

        var msg = this.props.messages.map(function (item) {
            return <MessageItem
                key={item.id}
                avatar={item.user.avatarUrl}
                name={item.user.displayName}
                message={item.message}
                datetime={item.datetime}
                />
        });
        return <div className="message-list" key={this.props.key} onScroll={this.onScroll} ref="messageList">
            {msg}
        </div>

    }
}
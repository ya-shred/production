import React from 'react';
import './index.styl';
import MessageItem from "../messageItem";

export default class MessageList extends React.Component {

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom = () => {
        var messageList = this.refs.messageList.getDOMNode();
        messageList.scrollTop = messageList.scrollHeight;
    }

    render() {

        var msg = this.props.messages.map(function (item) {
            return <MessageItem
                key={item._id}
                avatar={item.user.avatarUrl}
                name={item.user.displayName}
                message={item.message}
                datetime={item.datetime}
                />
        });
        return <div className="message-list" key={this.props.key}  ref="messageList">
            {msg}
        </div>

    }
}
import React from 'react';
import ActionMessage from '../../actions/message';
import MessageItem from "../messageItem";
import UsersListStore from '../../stores/usersList';
import NotFound from '../notFound';
import _ from "lodash";

export default class MessageList extends React.Component {

    constructor() {
        super();
        this.throttledScroll = _.throttle(this.scroll, 500);
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

    onScroll = (e) => {
        e.persist();
        this.throttledScroll(e);
    };

    scroll = (e) => {
        console.log(e.target.scrollTop);
        if(e.target.scrollTop <= 150) {
            ActionMessage.getMoreMessage;
        }
    };
    render() {

        let msg;

        if(this.props.messages.length === 0){
            msg = <NotFound text="Пусто!"/>;
        } else {
            msg = this.props.messages.map(function (item) {
                var messageUser = UsersListStore.getUserById(item.userId);
                return (
                    <MessageItem
                        key={item._id}
                        messageUser={messageUser}
                        message={item}
                        />
                );
            });
        }
        return (
            <div className="message-list" ref="messageList" onScroll={this.onScroll}>
                {msg}
            </div>
        );

    }

}
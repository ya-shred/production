import React from 'react';
import Textarea from '../textarea';
import SearchMessage from '../searchMessage';
import MessageStore from '../../stores/message';
import UsersListStore from '../../stores/usersList';
import MessageList from "../messageList";

var getMessages = () => {
    return MessageStore.getCurrentMessages();
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
        this.setState({messages: getMessages()});
    };

    componentWillUnmount() {
        MessageStore.removeChangeListener(this.onChange);
    }



    render() {
        return (
            <section className="chat-window">

                <SearchMessage/>

                <div className="chat-window__content">
                    <MessageList messages={this.state.messages} />
                </div>

                <div className="chat-window__box-send-message">
                    <Textarea/>
                </div>

            </section>
        );
    }

}

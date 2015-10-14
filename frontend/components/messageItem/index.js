import React from 'react';
import moment from 'moment';
import EditArea from '../editArea';
import MessageActions from '../../actions/message';
import UserStore from '../../stores/user.js';
export default class MessageItem extends React.Component {

    constructor() {
        super();
        this.state = {editing: false}
    }

    openEditArea = () => {
        this.setState({editing: true});
    };

    closeEditArea = () => {
        this.setState({editing: false});
    };

    render() {
        let editAera;
        let contentItemClass;
        let editButton;

        const currentUser = UserStore.getUserInfo();
        if (this.state.editing) {
            editAera = <EditArea message={ this.props.message } messageUser={ this.props.messageUser } onClose={this.closeEditArea} />;
            contentItemClass = "chat-window__content-item chat-window__content-item_editing"
        } else {
            contentItemClass = "chat-window__content-item"
        }

        if (this.props.message.userId === currentUser.id){
            editButton = <span className="chat-window__content-edit" onClick={this.openEditArea}></span>
        }
        return (
            <div className={contentItemClass} key={ this.props.key }>
                <figure className="chat-window__content-avatar">
                    <img className="chat-window__avatar" src={ this.props.messageUser.avatarUrl }/>
                </figure>
                <div className="chat-window__content-sending">
                    <div className="chat-window__content-name">
                        {this.props.messageUser.displayName}
                        <span className="chat-window__content-date">
                            {moment(+this.props.message.datetime).format('DD.MM.YYYY в HH:mm')}
                        </span>
                        {editButton}
                    </div>
                    <div className="chat-window__content-message">{ this.props.message.message }</div>
                </div>
                {editAera}
            </div>
        );
    }

}



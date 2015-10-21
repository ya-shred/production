import React from 'react';
import moment from 'moment';
import EditArea from '../editArea';
import MessageActions from '../../actions/message';
import UserStore from '../../stores/user.js';
import MessageTransform from '../messageTransform/messageTransform';

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

    save = () => {
        console.log('save message');
    };

    render() {
        let editAera;
        let contentItemClass;
        let editButton;
        let saveButton;

        const currentUser = UserStore.getUserInfo();
        if (this.state.editing) {
            editAera = <EditArea message={ this.props.messageObj }
                                 messageUser={ this.props.messageUser }
                                 onClose={this.closeEditArea}/>;
            contentItemClass = "chat-window__content-item chat-window__content-item_editing"
        } else {
            contentItemClass = "chat-window__content-item"
        }

        if (this.props.messageObj.userId === currentUser.id) {
            if (this.props.messageObj.type === 'simple_message') {
                editButton = <span className="chat-window__content-pic chat-window__content-pic_edit" onClick={this.openEditArea}></span>
            }

            if ((this.props.messageObj.type === 'simple_file' || this.props.messageObj.type === 'video_message')
                && currentUser.messageAvailable > currentUser.messageUsed) {
                saveButton = <span className="chat-window__content-pic chat-window__content-pic_save" onClick={this.save}></span>
            }
        }

        let message = MessageTransform.transform(this.props.messageObj.type, this.props.messageObj.additional);

        return (
            <div className={contentItemClass} key={ this.props.key }>
                <figure className="chat-window__content-avatar">
                    <img className="chat-window__avatar" src={ this.props.messageUser.avatarUrl }/>
                </figure>
                <div className="chat-window__content-sending">
                    <div className="chat-window__content-name">
                        {this.props.messageUser.displayName}
                        <span className="chat-window__content-date">
                            {moment(+this.props.messageObj.datetime).format('DD.MM.YYYY в HH:mm')}
                        </span>
                        {editButton}
                        {saveButton}
                    </div>
                    <div className="chat-window__content-message">{message}</div>
                </div>
                {editAera}
            </div>
        );
    }

}



import React from 'react';
import moment from 'moment';
import EditArea from '../editArea';
import MessageActions from '../../actions/message';
import ReplayActions from '../../actions/replay';
import UserStore from '../../stores/user.js';
import MessageTransform from '../messageTransform';

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
        MessageActions.saveFileMessage(this.props.messageObj);
    };

    replay = () => {
        ReplayActions.replay(this.props.messageObj.id);
    };

    render() {
        let editArea;
        let contentItemClass;
        let buttons = [];

        const currentUser = UserStore.getUserInfo();
        if (this.state.editing) {
            editArea = <EditArea message={ this.props.messageObj }
                                 messageUser={ this.props.messageUser }
                                 onClose={this.closeEditArea}/>;
            contentItemClass = "chat-window__content-item chat-window__content-item_editing"
        } else {
            contentItemClass = "chat-window__content-item"
        }

        if (!this.props.messageObj.additional.disabled && !this.props.disabled) {
            if (this.props.messageObj.userId === currentUser.id) {
                if (this.props.messageObj.type === 'simple_message') {
                    buttons.push(<span key="edit" className="chat-window__content-pic chat-window__content-pic_edit"
                                       onClick={this.openEditArea}></span>);
                }

                if ((this.props.messageObj.type === 'simple_file' || this.props.messageObj.type === 'video_message')
                    && currentUser.messageAvailable > currentUser.messageUsed) {
                    buttons.push(<span key="save" className="chat-window__content-pic chat-window__content-pic_save"
                                       onClick={this.save}></span>)
                }
            } else {
                buttons.push(<span key="replay" className="chat-window__content-pic chat-window__content-pic_replay"
                                   onClick={this.replay}></span>)

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
                        {buttons}
                    </div>
                    <div className="chat-window__content-message">{message}</div>
                </div>
                {editArea}
            </div>
        );
    }

}



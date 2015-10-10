import React from 'react';
import './index.styl';
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

    saveMessage = (text) => {
        MessageActions.sendUpdatedMessage({channel: 'general', id: this.props.messageId, userId: this.props.userId, message: text});
        this.setState({editing: false});
    };

    cancelEditing = () => {
        this.setState({editing: false});
    };

    render() {
        let editAera;
        let contentItemClass;
        let editButton;

        const currentUser = UserStore.getUserInfo();
        if (this.state.editing) {
            editAera = <EditArea value={ this.props.message } messageId={ this.props.messageId } onSave={this.saveMessage} onCancel={this.cancelEditing}/>;
            contentItemClass = "chat-window__content-item chat-window__content-item_editing"
        } else {
            contentItemClass = "chat-window__content-item"
        }

        if (this.props.userId === currentUser.id){
            editButton = <span className="chat-window__content-edit" onClick={this.openEditArea}>редактировать</span>
        }

        return (
            <div className={contentItemClass} key={ this.props.key }>
                <figure className="chat-window__content-avatar">
                    <img className="chat-window__avatar" src={ this.props.avatar }/>
                </figure>
                <div className="chat-window__content-sending">
                    <div className="chat-window__content-name">
                        {this.props.name}
                        <span className="chat-window__content-date">
                            {moment(+this.props.datetime).format('DD.MM.YYYY в HH:mm')}
                        </span>
                        {editButton}
                    </div>
                    <div className="chat-window__content-message">{ this.props.message }</div>
                </div>
                {editAera}
            </div>
        );
    }

}



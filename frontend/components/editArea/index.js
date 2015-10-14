import React from 'react';
import MessageActions from '../../actions/message';
import UserActions from '../../actions/usersList.js';
import TextareaSize from 'react-textarea-autosize';
const ENTER_KEY_CODE = 13; // код клавиши enter
const ESC_KEY_CODE = 27; // код клавиши esc

export default class EditArea extends React.Component {

    constructor(props) {
        super();
        this.state = {
            value: props.message.message || '',
            messageId: props.message._id || ''
        }
    }


    _onChange = (event) => {
        this.setState({value: event.target.value});
    };

    _onKeyDown = (event) => {
        if (event.keyCode === ENTER_KEY_CODE) {
            event.preventDefault();
            var text = this.state.value.trim();
            if (text) {
                this._save(this.state.value);
                this._close();
            }
        }
        if (event.keyCode === ESC_KEY_CODE){
            this._close();
        }
    };

    _save = (text) => {
        MessageActions.sendUpdatedMessage({channel: 'general', newText: text, messageObj: this.props.message, messageUser: this.props.messageUser});
    };

    _close = () => {
        this.props.onClose();
    };

    render() {
        return (
            <TextareaSize
                value={this.state.value}
                className="edit-area"
                placeholder="Введите сообщение"
                minRows={2}
                onChange={this._onChange}
                onKeyDown={this._onKeyDown}
                onBlur={this._close}
                autoFocus={focus}/>
        );
    }

}
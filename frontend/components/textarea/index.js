import React from 'react';
import MessageActions from '../../actions/message';
import TextareaSize from 'react-textarea-autosize';
const ENTER_KEY_CODE = 13; // код клавиши enter

export default class Textarea extends React.Component {

    constructor() {
        super();
        this.state = {value: ''}
    }


    _onChange = (event) => {
        this.setState({value: event.target.value});
    };

    _onKeyDown = (event) => {

        if (event.keyCode === ENTER_KEY_CODE) {
            event.preventDefault();
            var text = this.state.value.trim();
            if (text) {
                MessageActions.sendMessage({channel: 'general', message: text});
            }
            this.setState({value: ''});
        }
    };

    render() {
        return (
            <TextareaSize
                value={this.state.value}
                className="textarea"
                placeholder="Введите сообщение"
                minRows={2}
                onChange={this._onChange}
                onKeyDown={this._onKeyDown}
                maxLength={5000}
                autoFocus={focus}
                />
        )
    }

}
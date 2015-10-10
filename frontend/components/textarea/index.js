import React from 'react';
import MessageActions from '../../actions/message';
import './index.styl';
import TextareaSize from 'react-textarea-autosize';
const ENTER_KEY_CODE = 13; // код клавиши enter

class Textarea extends React.Component {

    constructor() {
        super();
        this.state = {value: ''}
    }

    render() {
        return (
            <TextareaSize
                value={this.state.value}
                minRows={2}
                style={{maxHeight: 200}}
                onKeyDown={this._onKeyDown}
                placeholder="Введит"
                className="textarea"
                onChange={this._onChange}/>
        )
    }

    _onChange = (event) => {
        this.setState({value: event.target.value});
    }

    _onKeyDown = (event) => {

        if (event.keyCode === ENTER_KEY_CODE) {
            event.preventDefault();
            var text = this.state.value.trim();
            if (text) {
                MessageActions.sendMessage({channel: 'general', message: text});
            }
            this.setState({value: ''});
        }
    }

}

export default Textarea;
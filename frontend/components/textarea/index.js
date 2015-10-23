import React from 'react';
import MessageActions from '../../actions/message';
import TextareaSize from 'react-textarea-autosize';
import ReplayStore from '../../stores/replay';
const ENTER_KEY_CODE = 13; // код клавиши enter

export default class Textarea extends React.Component {

    constructor() {
        super();
        this.state = {value: ''}
    }

    componentDidMount() {
        ReplayStore.addChangeListener(this.addReplay);
    }

    componentWillUnmount() {
        ReplayStore.removeChangeListener(this.addReplay);
    }

    addReplay = () => {
      this.setState({value: this.state.value + '{' + ReplayStore.getReplayId() + '}'});
    };

    _onChange = (event) => {
        this.setState({value: event.target.value});
    };

    _onKeyDown = (event) => {

        if (event.keyCode === ENTER_KEY_CODE) {
            event.preventDefault();
            var text = this.state.value.trim();
            if (text) {
                MessageActions.sendMessage({
                    channel: 'general',
                    type: 'simple_message',
                    additional: {
                        message: text
                    }
                });
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
                onKeyDown={this._onKeyDown}/>
        )
    }

}
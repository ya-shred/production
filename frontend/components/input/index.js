import React from 'react';
import './index.styl';

class Input extends React.Component {

    render() {
        return <input
            className={this.props.className }
            type={this.props.type }
            placeholder={this.props.placeholder}
            value={this.props.value }
            onClick={this.props.onClick }
            />

    }

}

export default Input;
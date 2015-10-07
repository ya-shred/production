import React from 'react';
import './index.styl';

export default class NotFound extends React.Component {

    render() {
        return (
            <p className="not-found">{this.props.text}</p>
        );
    }

}

import React from 'react';

export default class NotFound extends React.Component {

    render() {
        return (
            <p className="not-found">{this.props.text}</p>
        );
    }

}

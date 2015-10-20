import React from 'react';
import PopupStore from '../../stores/popup';

let getPopup = () => {
    return PopupStore.getPopup();
};

export default class Popup extends React.Component {

    constructor() {
        super();
        this.state = {
            popup: getPopup()
        };

    }

    componentDidMount() {
        PopupStore.addChangeListener(this.onChange);
    }

    onChange = () => {
        this.setState({popup: getPopup()});
    };

    componentWillUnmount() {
        PopupStore.removeChangeListener(this.onChange);
    }

    render() {
        if (this.state.popup) {
            return (
                <div className="popup">
                    <div className="popup__close"></div>
                    {this.state.popup}
                </div>
            );
        } else {
            return (<div></div>);
        }
    }
}
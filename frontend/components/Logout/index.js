import React from 'react';
import UserStore from '../../stores/user.js';
import LogoutActions from '../../actions/logout';
import './index.styl';

var getUserInfo = () => {
    return {
        user: UserStore.getUserInfo()
    }
};


export default class Logout extends React.Component {
    constructor() {
        super();
        this.state = getUserInfo();
    }



    handleClick = (event) => {
        LogoutActions.logout();
    };


    componentDidMount() {
        UserStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        UserStore.removeChangeListener(this.onChange);
    }

    onChange = () => {
        this.setState(getUserInfo());
    };


    render() {
        return <div className="logout">
            <div className="logout__wrapper">
                <img className="logout__img" src={this.state.user.avatarUrl}/>
            </div><div
            className="logout__name">{this.state.user.displayName}</div><button
            onClick={this.handleClick} className="logout__button"></button>
        </div>;

    }

};
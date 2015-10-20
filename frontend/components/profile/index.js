import React from 'react';
import UserStore from '../../stores/user';
import PopupActions from '../../actions/popup';

var getUserInfo = () => {
    return UserStore.getUserInfo();
};

export default class Profile extends React.Component {

    constructor() {
        super();
        this.state = {user: getUserInfo()};
    }

    componentDidMount() {
        UserStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        UserStore.removeChangeListener(this.onChange);
    }

    onChange = () => {
        this.setState({user: getUserInfo()});
    };

    closePopup() {
        PopupActions.closePopup();
    }

    render() {
        //console.log(this.state.user);
        return (
            <div className="profile">
                <div className="popup__close" onClick={this.closePopup}>X</div>
                <div className="profile__info">
                    <div className="profile__title">
                        Информация о пользователе:
                    </div>
                    <div className="profile__row">
                        Имя: {this.state.user.displayName}
                    </div>
                    <div className="profile__row">
                        Логин: {this.state.user.userName}
                    </div>
                </div>
            </div>
        );
    }
}
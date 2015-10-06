import React from 'react';
import UserItem from '../userItem';
import UsersListStore from '../../stores/usersList';
import './index.styl';

function getUsersState() {
    return {
        users: UsersListStore.getAllUsers()
    };
}

export default class UserList extends React.Component {
    constructor() {
        super();
        this.state = getUsersState();
    }

    handleChange = (e) =>
        this.setState({inputLogin: e.target.value});


    componentDidMount() {
        UsersListStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        UsersListStore.removeChangeListener(this.onChange);
    }

    onChange = () => {
        this.setState(getUsersState());
    };


    render() {
        const userItem = this.state.users.map(user => {
            var userStatusClass = '';
            if (user.online) {
                userStatusClass = "user-list__item online"
            } else {
                userStatusClass = "user-list__item offline"
            }
            return <UserItem
                key={user.id}
                user={user}
                userStatus={userStatusClass}/>;
        });
        return <ul className="user-list">
            {userItem}
        </ul>


    }

}

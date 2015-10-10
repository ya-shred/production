import React from 'react';
import './index.styl';
import UsersListStore from '../../stores/usersList';
import MessageStore from '../../stores/message.js';
import UserList from '../userList';
import SearchUser from '../searchUser';


var getUsersState = () => {
    return {
        users: UsersListStore.getAllUsers()
    };
};

export default class AsideLeft extends React.Component {

    constructor() {
        super();
        this.state = getUsersState();
    }

    componentDidMount() {
        UsersListStore.addChangeListener(this.onChange);
        MessageStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        UsersListStore.removeChangeListener(this.onChange);
        MessageStore.removeChangeListener(this.onChange);
    }

    onChange = () => {
        this.setState(getUsersState());
    };

    handleChange = (e) => {
        this.setState({inputLogin: e.target.value});
    };

    render() {
        return (
            <aside className="aside-left">
                <SearchUser />
                <UserList users={this.state.users} />
            </aside>
        );
    }

}
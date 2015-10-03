import React from 'react';
import './index.styl';
import UserList from '../userList';
import SearchUser from '../searchUser';

export default class AsideLeft extends React.Component {

    render() {
        return <aside className="aside-left">
            <SearchUser />
            <UserList />
        </aside>

    }
}

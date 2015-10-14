import React from 'react';
import UserListActions from '../../actions/usersList.js'

export default class SearchUser extends React.Component {

    search = (e) => {
        var text = e.target.value;
        UserListActions.searchUser(text);
    };

    render() {
        return (
            <div className="search-user">
                <input type="text" placeholder="Поиск по пользователям:" className="search-user__input" onChange={this.search}/>
            </div>
        );
    }

}
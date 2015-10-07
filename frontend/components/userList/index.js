import React from 'react';
import UserItem from '../userItem';
import NotFound from '../notFound';
import './index.styl';

export default class UserList extends React.Component {

    render() {
        let userItem;
        if(this.props.users.length === 0){
            userItem = <NotFound text="Пусто!"/>;
        }
        else {
            userItem = this.props.users.map(user => {
                let userStatusClass;
                if (user.online) {
                    userStatusClass = "user-list__item online"
                } else {
                    userStatusClass = "user-list__item"
                }
                return (
                    <UserItem
                        key={user.id}
                        user={user}
                        userStatus={userStatusClass}/>
                );
            });
        }

        return (
            <ul className="user-list">
                {userItem}
            </ul>
        );


    }

}
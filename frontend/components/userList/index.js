import React from 'react';
import UserItem from '../userItem';
import UsersListStore from '../../stores/usersList';
import NotFound from '../notFound';
import MessageStore from '../../stores/message.js';

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
                let userLastMessage = MessageStore.getUserLastMessage(user.id);
                let userMessagesNumber = MessageStore.countUserMessagesNumber(user.id);

                return (
                    <UserItem
                        key={user.id}
                        user={user}
                        userStatus={userStatusClass}
                        lastMessage={userLastMessage}
                        messagesNumber={userMessagesNumber}/>
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
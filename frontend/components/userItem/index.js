import React from 'react';
import moment from 'moment';

export default class UserItem extends React.Component {
    render() {
        let lastMessageDatetime;
        let lastMessageText;
        if(this.props.lastMessage){
             lastMessageDatetime = moment(+this.props.lastMessage.datetime).format('HH:mm');
             lastMessageText = this.props.lastMessage.message;
        }
        return <li className={this.props.userStatus}>
            <div className="user-list__photo">
                <img className="chat-window__avatar" src={this.props.user.avatarUrl}/>
            </div>
            <div className="user-list__box-content">
                <div className="user-list__content">
                    <div className="user-list__box-name"><span
                        className="user-list__name">{this.props.user.displayName}</span>

                        <div className="user-list__status"/>
                    </div>
                </div>
            </div>
        </li>;
    }
}
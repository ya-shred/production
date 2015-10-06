import React from 'react';

export default class UserItem extends React.Component {
    render() {
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
                    <div className="user-list__date">19:45</div>
                </div>
                <div className="user-list__content">
                    <div className="user-list__last-message">
                        Всю жизнь боялся Человека тапка
                    </div>
                    <div className="user-list__current-new-message">5</div>
                </div>
            </div>
        </li>;
        //<div className='user-item'>
        //    <div className="user-item__avatar">
        //        <img className="user-item__img" width="40" height="40" src={this.props.user.avatarUrl} />
        //        <div className={this.props.userState}></div>
        //    </div>
        //    <div className="user-item__display-name">{this.props.user.displayName}</div>
        //    <h5 className="user-item__login">{this.props.user.userName}</h5>
        //    <a href={this.props.user.profileUrl} title={this.props.user.userName} className="user-item__url-icon icon-github"></a>
        //</div>

    }
}
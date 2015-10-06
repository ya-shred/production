import React from 'react';
import './index.styl';

export default class SearchUser extends React.Component {

    render() {
        return (
            <div className="search-user">
                <input type="text" placeholder="Поиск" className="search-user__input"/>
            </div>
        )
    }
}

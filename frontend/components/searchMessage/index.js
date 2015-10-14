import React from 'react';
import MessageActions from '../../actions/message';

export default class SearchMessage extends React.Component {

    search = (e) => {
        var text = e.target.value;
        MessageActions.searchMessage(text);
    };

    render() {
        return (
            <div className="search-message">
                <input type="text" placeholder="Поиск по сообщениям:" className="search-message__input" onChange={this.search}/>
            </div>
        );
    }

}

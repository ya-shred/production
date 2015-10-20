import React from 'react';
import Logout from '../logout';
import logo from './logo.svg';

export default class Header extends React.Component {

    render() {
        return (
            <header className="header">
                <figure className="header__logo">
                    <img src={logo}/>
                </figure>
                <Logout />
            </header>
        );
    }
}
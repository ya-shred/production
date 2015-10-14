import React from 'react';
import './index.styl';
import Logout from '../Logout';
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
import React from 'react';
import './index.styl';

import Logout from '../Logout';

export default class Header extends React.Component {

    render() {
        return (
            <header className="header">
                <h1></h1>
                <Logout />
            </header>
        )

    }
}
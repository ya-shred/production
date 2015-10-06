import React from 'react';
import '../app-styles/app.styl';
import Header from './header';
import ContainerChat from './containerChat';

export default class Components extends React.Component {

    render() {
        return (
            <div>
                <Header/>
                <ContainerChat/>
            </div>
        );
    }
}

import React from 'react';

export default class DropZone extends React.Component {
    render() {
        return (
            <div className="dropzone">
                <div className="dropzone__wrapper">
                    <div className="dropzone__text">
                        Перетащите файл сюда
                    </div>
                </div>
            </div>
        );
    }
}
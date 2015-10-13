import React from 'react/addons';
import VideoCall from './index.js';

VideoCall.__Rewire__('VideoAction', {
    callToAll: () => {
    },
    stopCall: () => {
    }
});
VideoCall.__Rewire__('VideoStore', {
    getAllStreams: () => {
        return []
    },
    addChangeListener: () => {
    },
    removeChangeListener: () => {
    }
});

let TestUtils = React.addons.TestUtils;

describe('VideoCall', () => {
    it('Can start call in init state', () => {
        var video = TestUtils.renderIntoDocument(
            <VideoCall />
        );

        var button = video.refs['call'];

        expect(button.props.disabled).not.toBe(true);
    });

    it('Cannot stop call in init state', () => {
        var video = TestUtils.renderIntoDocument(
            <VideoCall />
        );

        var button = video.refs['stopCall'];

        expect(button.props.disabled).toBe(true);
    });
});
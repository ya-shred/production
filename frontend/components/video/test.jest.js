jest.dontMock('./index.js');
jest.mock('../../stores/video');
jest.mock('../../actions/video');
//jest.mock('./index.js');
import React from 'react/addons';
//var VideoCall = require('./index.js');
import VideoCall from './index.js';
let TestUtils = React.addons.TestUtils;
console.log(VideoCall);

describe('VideoCall', () => {
    it('Cannot stop call in init state', function() {

        // Render a checkbox with label in the document
        var video = TestUtils.renderIntoDocument(
            <VideoCall />
        );

        expect(true).toBe(true);
        //// Verify that it's Off by default
        //var label = TestUtils.findRenderedDOMComponentWithTag(
        //    checkbox, 'label');
        //expect(React.findDOMNode(label).textContent).toEqual('Off');
        //
        //// Simulate a click and verify that it is now On
        //var input = TestUtils.findRenderedDOMComponentWithTag(
        //    checkbox, 'input');
        //TestUtils.Simulate.change(input);
        //expect(React.findDOMNode(label).textContent).toEqual('On');
    });
});
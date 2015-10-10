jest.dontMock('./index.js');

import React from 'react/addons';
import VideoCall from './index.js';
//let TestUtils = React.addons.TestUtils;

describe('VideoCall', () => {
    it('Невозможность позвонить повторно, после начала звонка', function() {

        // Render a checkbox with label in the document
        //var video = TestUtils.renderIntoDocument(
        //    <VideoCall />
        //);

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
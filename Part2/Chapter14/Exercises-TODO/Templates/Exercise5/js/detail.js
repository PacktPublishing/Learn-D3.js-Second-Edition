import * as d3 from 'https://cdn.skypack.dev/d3@7';

import {app} from './common.js';

import {inBrush, isValid} from "../../../../js/brush-utils.js";

// EXERCISE.
// 1) See common-1.0.js; 2) and 3) See view.js
// 4) Declare a variable to store the current brush selection
// ADD CODE HERE

// 5) Implement and export the setup() function (used in view.js).
export function setup() {
    //   a) create a brush layer (append it to the SVG) and call the app.brush function
    // ADD CODE HERE

    //  b) Configure the app.brush function: add event listeners for the 'brush' and 'end' events,
    //     and highlight the selected circles in red. Use rescale and updateView functions in 'end'.
    //     Note: require the shift key to activate the brush (use filter and keyModifiers)
    // ADD CODE HERE
}

// 6) Define a function to rescale the chart based on the brush selection
//    Call this function in the "end" event listener
function rescale([start, end]) {
    // ADD CODE HERE
}

// 7) Define a function to call the axes and update the view (circle positions and fill).
//    Call this function in the "end" event listener after rescaling
function updateView() {
    // ADD CODE HERE
}
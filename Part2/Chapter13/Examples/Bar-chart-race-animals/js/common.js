import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";
export { app, dim, chart, getTransition };

// Global chart data object (will contain the data and some helper functions)
// After initialization will contain: nxt, prv, data, keys, cats, icons, state, paused
const chart = {
    paused: false,  // true when user pauses animation
    state: 0 // saves the frame number when paused, which is retrieved when animation resumes
};

// An object for global settings, functions and configurations
const app = {

    // Icon configuration:
    // Directory where the icons are stored (the file name is the "Type" column + ".png" (e.g. bat.png)
    img: {
        directory: null, // REQUIRED if using images. If null, images will not be loaded
        svgAspectRatio: "xMidYMid meet", // Default aspect ratio for the icons
        extraWidth: 0   // How larger is width compared to height (0 = same width)
    },

    // Transition configuration: Frames are used to produce keyframes that interpolate between data points.
    // This will interpolate values and make the bars grow and shrink slower than they change rank.
    // As a result the transition will run smoother.
    transition: {
        duration: 600,   // duration of the transition that changes the order of the bars
        numFrames: 30    // multiplies the duration and affects the transition that changes the lengths of the bars
    },

    // Other configuration that the user can override
    barHeight: 40,  // chart height is computed based on this value
    numBars: 10,    // number of bars to display (the ones with the highest values will be displayed)
    formatSpecifier: '.2f',  // A format string for the values (default is decimal)
    replaceBillions: false,  // Replace the "G" in large SI (format "s") values with "B" (for billions)
    
    // Scale configuration: The y domain will contain the number of bars + 1, reflected in the range, which adds
    // dim.height/n. This will allow the entering/leaving bars to appear at the bottom of the chart.
    scale: {
        x: d3.scaleLinear(), // The x scale will fit the values for each bar.
        y: d3.scaleBand()
    },

    // Axis configuration: The axis will be at the top of the chart and ticks will grow downwards
    // It will be updated as the values and scale changes
    axis: d3.axisTop().tickSizeOuter(0),

    fmt: null, // initialized in config
    colorScale: d3.scaleOrdinal(d3.schemeCategory10),
    useIcon: false,         // initialized in verify
    useCategory: false,     // initialized in verify
}

const dim = {width: 800,
    height: app.barHeight * app.numBars - 20,
    margin: {top: 15, right: 10, bottom: 5, left: 100}
};

/**
 * A transition factory. Returns a pre-configured transition object.
 * @returns {*}
 */
function getTransition() {
    return d3.transition().duration(app.transition.duration).ease(d3.easeLinear);
}






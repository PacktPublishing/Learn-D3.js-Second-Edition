import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// GLOBAL CONSTANTS: app & dim

/**
 * app: This object contains data used for the application.
 * app.planets: Array of planetary data (loaded from external file)
 * app.colors: Array of colors for the planets
 * app.scale: Scale to convert km to pixels
 * app.current: Object with current data for the view {id, planet, color, moons}
 *   app.current.id: Key to select current object
 *   app.current.planet: Object used in the current view
 *   app.current.color: Color of the planet
 *   app.current.moons: Moons to be displayed
 */
export const app = {
    planets: [],
    colors: ['#4169e1','#cc8530','#d4a450','#dab520','#7fffd4','#1e90ff'],
    scale: d3.scaleLinear(),
    current: {
        id: null,           // key to select current object
        planet: {},         // the object used in the current view
        color: "black",     // color of the planet
        moons: []           // the moons to be displayed
    }
}
app.current.id = "p5"; // starting with Jupiter id = "p5"

/**
 * dim: This object contains dimensions for the view.
 *   dim.width: Width of the SVG element
 *   dim.height: Height of the SVG element
 *   dim.margin: Object with margins for the SVG element
 *     dim.margin.left: Left margin
 *     dim.margin.right: Right margin
 *     dim.margin.top: Top margin
 *     dim.margin.bottom: Bottom margin
 *     dim.margin.moon: Horizontal space between moons
 *     dim.margin.planet: Horizontal space reserved for the planet
 */
export const dim = {
    width: 500,
    height: 300,
    margin: {
        left: 20,
        right: 20,
        top: 50,
        bottom: 50
    }
};
dim.margin.moon = 10;    // horiz space between moons
dim.margin.planet = 100; // horiz space reserved for the planet

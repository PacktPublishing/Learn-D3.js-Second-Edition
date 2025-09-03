import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {app} from "./common.js";

const fmt = d3.format(",");

export function showTooltip(event, d) {
    // EXERCISE 6.5: Implement the showTooltip function
    // 1) Select the tooltip that was added in the HTML file's <script> block using its class
    // 2) Raise the tooltip above the other elements
    // 3) Set the position of the tooltip element using the translate transform (place it near the planet or satellite)
    // 4) Transition the opacity of the tooltip element to 1
    // 5) Set the text of the tooltip element to show the diameter of the planet or satellite
}

export function hideTooltip() {
    // EXERCISE 6.5: Implement the hideTooltip function
    // 1) Select the tooltip that was added in the HTML file's <script> block using its class
    // 2) Transition the opacity of the tooltip element to 0
}
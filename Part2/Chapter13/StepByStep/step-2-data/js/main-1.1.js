import * as view from "./view-1.0.js";
import * as data from "./data-1.0.js";
import {chart} from "./common-1.0.js";

// Data source file location
const file = "../data/un_gdp.csv";

// Load the data and run the application
data.load(file)
    .then(() => {
        view.draw();
        console.log(chart); // inspect the chart object
    });
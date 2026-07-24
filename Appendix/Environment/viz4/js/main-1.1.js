import {load} from "./data-1.2.js";
import {data} from "./common-1.1.js";
import {draw} from "./view-1.0.js";

await load();
console.log(data);  // check the data
draw();
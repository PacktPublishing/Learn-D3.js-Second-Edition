import {load, config} from "./data-1.3.js";
import {data} from "./common-1.1.js";

await load();
console.log(data);  // check the data
config();   // configure scales
import {load} from "./data.js";
import {data} from "./common.js";
import {config} from "./data.js";
import {draw} from "./view.js";

await load();
console.log(data);
config();
draw();


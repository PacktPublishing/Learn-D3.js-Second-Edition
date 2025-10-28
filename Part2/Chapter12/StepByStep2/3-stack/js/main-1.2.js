import "./view-1.0.js";
import {load} from "./data-1.1.js";
import {data} from "./common-1.0.js";

load().then(() => console.log(data));
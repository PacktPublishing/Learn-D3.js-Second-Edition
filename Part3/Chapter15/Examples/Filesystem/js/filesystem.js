import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";

// 1) Load the filesystem data
const file = "../../data/filesystem.txt";
const data = await d3.text(file);

// 2) Parse the data: append 'root' before each line and replace initial slash with 'root'.
const rootPath = "root";
const paths = data.split('\n').map(line => {
    return line.trim() ? rootPath + line.trim() : '';
}).filter(line => line !== '');
paths[0] = rootPath; // Ensure the root path is set correctly

// 3) Hierarchy generation using d3.stratify
const hierarchy = d3.stratify()
    .id(d => d)
    .parentId(d => d.substring(0, d.lastIndexOf('/')));

export const root = hierarchy(paths.filter(d => d.trim() !== ''));

// add a random filesize to each leaf node, from 1000 to 14000
root.each(d => {
    if (d.children) {
        d.data = {path: d.data}; // parent nodes have no weight
    } else {
        d.data = {path: d.data, fileSize: Math.floor(Math.random() * 4000) + 1000}; // leaf nodes get a random weight
    }
});


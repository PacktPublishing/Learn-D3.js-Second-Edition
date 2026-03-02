import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";

const grid = {exes: null, wyes: null};  // x,y grid data

export function gridData(width, height, space = 50) {
    grid.exes = d3.range(0, width + 1, space)
        .map(d => [[d, 0], [d, height]]);
    grid.wyes = d3.range(0, height + 1, space)
        .map(d => [[0, d], [width, d]]);

    return [grid.exes, grid.wyes].flat();
}
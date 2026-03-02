import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";
import {rootFromRollup, makeLinePairs} from "../../../../js/nest.js";

/**
 * Returns a root node for a dendrogram layout.
 * @param size [h,w] for horizontal, [v,h] for vertical
 * @returns {*}
 */
export function makeTree(tabular, size, isTidyTree = true) {
    const keyFunctions = [d => d.Supercontinent, d => d.Continent, d => d.UN_Region, d => d.Country];
    const rollupRoot = d3.rollup(tabular, d => d, ...keyFunctions);
    const hierarchy = rootFromRollup(rollupRoot, "World", false); // true: merge branches with single child and same key

    const root = d3.hierarchy(hierarchy);
    if (isTidyTree) {
        d3.cluster().size(size)(root); // Create a dendrogram layout
    } else {
        d3.tree().size(size)(root); // Create a tidy ree layout
    }
    return root;
}

/** Draw the tree using the specified orientation and line type */
export function draw(orientation = 'horizontal', data, container, lineType = 'line', link) {
    const lines = (lineType === 'path') ? makeLinePairs(data) : data.links();
    drawLinks(container.append("g").attr("class", "links"), lines, lineType, link);
    drawNodes(container.append("g").attr("class", "nodes"), data.descendants(), orientation);
}

/** Draw nodes as circles and labels */
export function drawNodes(g, data, orientation) {
    g.selectAll("g.node")
        .data(data)
        .join('g')
        .attr("class", "node")
        .attr('transform', d => getTransform(d, orientation))
        .each(function() {
            const node = d3.select(this);
            node.append("circle")
                .attr('r',
                    d => d.height > 0 && d.depth !== 0 ? 2 : d.depth === 0 ? 4 : 1);
            node.append("text")
                .attr('x', 5)
                .text(d => d.data.id)
                .attr("class",
                    d => d.height > 0 && d.depth !== 0
                        ? "continent" : d.depth === 0 ? "world" : "country");
        });
}

/** Get the transform attribute for the node based on orientation */
function getTransform(d, orientation) {
    if (orientation === 'vertical') {
        return `translate(${d.x},${d.y})`;
    } else if (orientation === 'horizontal') {
        return `translate(${d.y},${d.x})`;
    } else { // radial
        return `rotate(${d.x}) translate(${d.y})`;
    }
}

/** Draw links between nodes using different techniques */
export function drawLinks(g, data, lineType, link) {
    if(lineType === 'link') {
        useLinks(g, data, link);
    } else if(lineType === 'path') {
        usePaths(g, data);
    } else {
        useLines(g, data);
    }
}

/**
 * Using SVG <line> elements to draw links
 * @param g
 * @param data
 */
function useLines(g, data) {
    g.selectAll('line').data(data).join('line')
        .attr('x1', d => d.source.y)
        .attr('y1', d => d.source.x)
        .attr('x2', d => d.target.y)
        .attr('y2', d => d.target.x);
}

/**
 * Using SVG <path> elements to draw links
 * @param g
 * @param data
 */
function usePaths(g, data) {
    g.selectAll('path').data(data).join('path')
        .attr('d', d3.line());
}

/**
 * Using generated path links (d3.link) from data to draw the links.
 * @param g
 * @param data
 * @param link
 */
function useLinks(g, data, link) {
    g.selectAll("path").data(data).join('path')
        .attr("d", link);
}
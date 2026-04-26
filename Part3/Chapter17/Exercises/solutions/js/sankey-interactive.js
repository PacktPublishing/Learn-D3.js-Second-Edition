import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as d3x from "https://cdn.skypack.dev/d3-sankey@0";

export {highlightNode, highlightPath, fade, dragStart, dragging, dragEnd, sankey};

let timeout = null;

const sankey = d3x.sankey();
sankey.graph = [];

function highlightNode(evt, node) {
    d3.selectAll(".node").classed('faded', d => !(d === node) && !d.sourceLinks.some(link => link.target === node) && !d.targetLinks.some(link => link.source === node));
    d3.selectAll(".link").classed('faded', edge => !(edge.source === node || edge.target === node));
}
function highlightPath(evt, edge) {
    d3.selectAll(".node").classed('faded', node => !(node === edge.source || node === edge.target));
    d3.selectAll(".link").classed('faded', d => !(d === edge));
}
function fade() {
    clearTimeout(timeout);
    d3.selectAll(".node, .link").classed('faded', false)
}

function dragStart(evt, d) {
    d.dy = evt.y - d.y0;
    d3.selectAll(".link, .node").style("pointer-events", 'none');
    d3.select(this).raise().classed("active", true);
}

function dragging(evt, d) {
    d.y0 = evt.y - d.dy;
    d3.select(this).attr("transform", `translate(${[d.x0,d.y0]})`);
    sankey.update(sankey.graph);
    d3.selectAll('.link').attr("d", d3x.sankeyLinkHorizontal());
}

function dragEnd() {
    d3.selectAll(".link, .node").style("pointer-events", 'auto')
    d3.select(this).classed("active", false);
}
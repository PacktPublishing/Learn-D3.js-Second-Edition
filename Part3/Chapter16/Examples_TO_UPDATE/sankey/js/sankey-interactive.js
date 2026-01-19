import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";
import * as d3x from "https://cdn.skypack.dev/d3-sankey@0";

export {highlightNode, highlightPath, fade, dragStart, dragging, dragEnd, sankey};

let timeout = null;

const sankey = d3x.sankey();
sankey.graph = [];

function highlightNode(evt, node) {
    timeout = setTimeout(function () {
        d3.selectAll(".node").classed('faded', d => !(d === node));
        d3.selectAll(".link").classed('faded', edge => !(edge.source === node || edge.target === node));
    }, 500);
}
function highlightPath(evt, edge) {
    timeout = setTimeout(function () {
        d3.selectAll(".node").classed('faded', node => !(node === edge.source || node === edge.target));
        d3.selectAll(".link").classed('faded', d => !(d === edge));
    }, 500);
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
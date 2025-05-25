import * as d3 from "https://cdn.skypack.dev/d3@7"

const leafRadiusHover = 6;
const groupRadiusHover = 4;
const strokeWidthHover = 4;
const dotLeafColorHover = "red";
const dogGroupColorHover = "red";
const pathColorHover = "gold";

// Highlight node when hovering over circle or text
export function addHighlightPath(chart, styles) {

    chart.selectAll("g.leaf")
        .on("mouseover", function(evt, d) {
            chart.selectAll("text").style("opacity", .5);

            d3.select(this).select("circle").attr("r", leafRadiusHover).attr("fill", dotLeafColorHover);
            d3.select(this).select("text")
                            .style("font-weight", "bold")
                            .style("font-size", '1.4em')
                            .style("opacity", 1);

            const ancestors = d.ancestors();
            const nodeNames = ancestors.map(n => n.data.node);
            const nodes = d3.selectAll("g.group")
                            .filter(n => d.ancestors().includes(n));

            nodes.select("circle").attr("r", groupRadiusHover)
                 .style("fill", dogGroupColorHover);
            nodes.select("text")
                 .style("font-size", '1.4em')
                 .style("opacity", 1);

            chart.selectAll("path")
                 .filter(n => nodeNames.includes(n.target.data.node))
                 .style("stroke", pathColorHover)
                 .style("stroke-width", strokeWidthHover);
        })
        .on("mouseout", function() {
            chart.selectAll("text")
                 .style("opacity", 1);
            d3.select(this).select("circle")
                 .attr("r", styles.leafRadius)
                 .style("fill", styles.dotLeafColor);
            d3.select(this).select("text")
                 .style("font-weight", "normal")
            chart.selectAll("text")
                 .style("font-size", '1em');
            chart.selectAll("g.group").select("circle")
                 .attr("r", styles.groupRadius)
                 .style("fill", styles.dotGroupColor);
            chart.selectAll("path")
                 .style("stroke", styles.pathColor)
                 .style("stroke-width", styles.strokeWidth);
        });
}
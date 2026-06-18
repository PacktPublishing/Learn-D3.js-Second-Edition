import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import {map} from "../../js/maps.js";

export function createDateSwitcher(currentDate, currentDayOfYear, callback) {
    let panel = d3.select("#season");
    if(panel.empty()) {
        panel = d3.select("body").insert("div", map.view);
    }
    const form = panel.append("form").attr("id", "season-form");

    const row = form.append("label");
    row.append("span").text("Date selector");

    row.append("input")
        .attr("type", "range")
        .attr("name", "season")
        .attr("min", 0)
        .attr("max", 364)
        .attr("step", 1)
        .attr("value", currentDayOfYear) // start at today
        .on("input", evt => {
            requestAnimationFrame(() => {
                const dayOfYear = +evt.target.value;
                valueLabel.text(d3.utcFormat("%B %d")(dayOfYearToDate(dayOfYear)));
                callback(dayOfYear);
            });
        });

    const valueLabel = row.append("span")
        .attr("id", "season-label")
        .style("float", "right")
        .text(d3.utcFormat("%B %d")(currentDate));
}

// Convert a 0-364 day-of-year back to a Date in the current year
function dayOfYearToDate(dayOfYear) {
    const jan1 = d3.utcYear(new Date());
    return d3.utcDay.offset(jan1, dayOfYear);
}
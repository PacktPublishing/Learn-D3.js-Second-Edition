import * as d3 from "https://cdn.skypack.dev/d3@7";
import {app, data, dim} from "./common.js";

export async function load(file) {
    const csv = await d3.csv(file, d3.autoType)
    console.log('csv', csv);

    // 1) group by month
    const byMonth = d3.rollup(csv, v => v.map(o => ({Year: o.Year, Value: o.Rain})), d => d.Month);
    console.log('byMonth', byMonth);

    // 2) compute max, min, and average (mean or median) for each month
    data.stats = Array.from(byMonth, ([key, value]) => {
        const max = d3.max(value, d => d.Value);
        const min = d3.min(value, d => d.Value);
        const avg = d3.median(value, d => d.Value);
        const month = d3.timeFormat('%b')(d3.isoParse(`2020-${key}-15`));
        return {month: month, max: max, min: min, avg: avg};
    });
    console.log('data.stats', data.stats);

    config();
}

function config() {
    app.scale.x.domain(data.stats.map(d => d.month));
    app.scale.y.domain([0, d3.max(data.stats, d => d.max) + 100]);

    app.area = d3.area()
        .x(d => app.scale.x(d.month))
        .y1(d => app.scale.y(d.max))
        .y0(d => app.scale.y(d.min))
        .curve(d3.curveNatural);

    app.line.top = app.area.lineY1();
    app.line.base = app.area.lineY0();

    app.line.avg = d3.line()
        .x(d => app.scale.x(d.month))
        .y(d => app.scale.y(d.avg))
        .curve(d3.curveNatural);

    app.color = d3.scaleOrdinal(["olive", "navy", "blue"]);
}
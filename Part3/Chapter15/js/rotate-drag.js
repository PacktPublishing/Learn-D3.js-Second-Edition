import * as d3 from "https://cdn.skypack.dev/d3@7";

// Very simple draggable rotation
export function addRotateDrag(chart, dim, initialAngle = 0) {
    const state = {r: initialAngle, x: dim.width/2, y: dim.height/2}

    chart.attr("transform", `translate(${[dim.width / 2, dim.height / 2]}) rotate(${state.r})`);

    chart.call(d3.drag()
        .on("start", function(evt) {
            const ctm = this.getCTM();
            const x = evt.x - ctm.e;
            const y = evt.y - ctm.f;
            state.startAngle = Math.atan2(y, x) * 180 / Math.PI;
        })
        .on("drag", function(evt) {
            const ctm = this.getCTM();
            const x = evt.x - ctm.e;
            const y = evt.y - ctm.f;
            const currentAngle = Math.atan2(y, x) * 180 / Math.PI;
            state.r += currentAngle - state.startAngle;
            state.startAngle = currentAngle;
            chart.attr("transform", `translate(${[dim.width / 2, dim.height / 2]}) rotate(${state.r})`);
        }));
}


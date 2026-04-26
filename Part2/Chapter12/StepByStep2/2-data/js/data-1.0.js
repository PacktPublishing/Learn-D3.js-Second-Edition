import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const file = "../../data/slave-trade-data.csv";

export async function load() {
    const rawData = await d3.csv(file, row => {
        row.Decade = +row.Decade.split("-")[0] - 1;  // Parse decade as a number
        Object.entries(row).forEach(([k,v]) => {
            if (k !== "Decade") row[k] = +v;
        });
        return row;
    });

    return rawData;
}

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

self.onmessage = async function(e) {
    try {
        const result = await processData(e.data);
        self.postMessage(result);
    } catch (err) {
        console.error('Worker error:', err);
        self.postMessage({ error: err.message || String(err) });
    }
};

const rightAscension = d3.scaleLinear().domain([0,24]).range([180,-180]);

async function processData(msg) {
    if (msg && msg.url) {
        const stars = await d3.csv(msg.url, row => {
            return {
                id: row.StarID,
                name: row.ProperName && row.ProperName.trim().length > 0 ? row.ProperName : `HIP ${row.Hip}`,
                coordinates: [rightAscension(+row.RA), +row.Dec],
                magnitude: +row.Mag,
                spectrum: row.Spectrum,
                colorIndex: +row.ColorIndex
            };
        });
        return stars.filter(d => d.magnitude < 6);
    } else {
        console.error('Worker error:', msg && msg.error);
        return Promise.resolve(null);
    }
}
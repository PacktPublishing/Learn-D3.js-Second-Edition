// Worker to process large datasets without blocking the main thread
self.onmessage = function(e) {
    const { shapes, deaths, population } = e.data;
    const features = shapes.features;

    // attach props
    const mapDeaths = new Map((deaths || []).map(t => [String(t.cod_ibge), t]));
    const mapPop = new Map((population || []).map(t => [String(t.cod_ibge), t]));

    for (let i = 0; i < features.length; i++) {
        const d = features[i];
        if (!d || !d.properties) continue;
        const rawId = typeof d.properties.id === 'string' ? d.properties.id : String(d.properties.id || '');
        const id6 = rawId.substring(0, 6);
        const key = String(+id6); // numeric-string key
        const entryD = mapDeaths.get(key);
        const entryP = mapPop.get(key);
        const deaths = (entryD && entryD.deaths) ? entryD.deaths : 0;
        const population = (entryP && entryP.population) ? entryP.population : 0;
        d.properties.deaths = deaths;
        d.properties.population = population;
        d.properties.deathsPerHab = population ? deaths / population : 0;
    }

    // send processed features back to main thread
    self.postMessage({ features });
};
// Worker to process large datasets without blocking the main thread
self.onmessage = function(e) {
    const { shapes, thematic1, thematic2 } = e.data;
    const features = shapes.features;

    // attach properties
    for (let i = 0; i < features.length; i++) {
        const d = features[i];
        const id6 = d.properties.id.substring(0, 6);
        const entry1 = thematic1.find(t => t.cod_ibge === +id6) || { deaths: 0 };
        const entry2 = thematic2.find(t => t.cod_ibge === +id6) || { population: 0 };
        d.properties.deaths = entry1.deaths || 0;
        d.properties.population = entry2.population || 0;
        d.properties.deathsPerHab = entry2.population ? entry1.deaths / entry2.population : 0;
    }

    // send processed features back to main thread
    self.postMessage({ features });
};
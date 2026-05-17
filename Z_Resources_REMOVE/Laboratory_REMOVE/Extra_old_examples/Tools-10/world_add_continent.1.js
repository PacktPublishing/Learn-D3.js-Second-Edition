const fs = require('fs');
const Promise = require('promise');
const d3 = require('d3');
const Papa = require('papaparse');

if (typeof fetch !== 'function') {
    global.fetch = require('node-fetch-polyfill');
} else {
    console.log('*')
}
const csv  = require('d3-fetch').csv;
const json = require('d3-fetch').json;

const source1 = '../Data/world-lowres.geojson';
const source2 = '../Data/un_regions.csv';
const target = '../Data/world-lowres.geojson';

Promise.all([
    json(source1),
    csv(source2, function(row) {
        return {
            continent: row.Continent,
            code: row.Code
        };
    })
]).then(([world, regions]) => {
    console.log('xx')
    const newData = [];
    const nothing = [];
    const matches = [];

    world.features.forEach(function(c) {
        let match = false;
        regions.forEach(function(r) {
            if (r.Code == c.Id) {
                match = true;
                if(!c.Continent) {
                    c.Continent = r.Continent;
                    newData.push(r.Country);
                } else {
                    nothing.push(r.Country);
                    c.Continent = 'Unknown'
                }
            }
        });
        if(!match) {
            matches.push(c.Code);
            c.Continent = 'Unmatched'
        }
    });
    
    console.log("NO MATCHES", matches.length);
    console.log("NEWDATA", newData.length);
    console.log("NOTHING size", nothing.length);

    writeFile(JSON.stringify(world));
});

function writeFile(data) {
    fs.writeFile(target, data, (err) => {
        if(err) throw err;
        console.log('Done')
    });
}
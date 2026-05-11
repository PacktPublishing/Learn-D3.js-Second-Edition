const fs = require('fs');
const Promise = require('promise');
const Papa = require('papaparse');

const source = '../Data/africa-roads.geojson';
const target = '../Data/africa-roads-filter.geojson';

fs.readFile(source, 'utf8', (err, data) => {
    if(err) {
        throw err;
    } else {
        process(JSON.parse(data));
    }
})

function process(results) {
    console.log(results['features'].length)
    const data = results.filter(d => d.properties.SrfTpe <= 2);
    console.log(data.length)

    //results.features = data;
    //writeFile(JSON.stringify(results));
}

function writeFile(data) {
    fs.writeFile(target, data, (err) => {
        if(err) throw err;
        console.log('Done')
    });
}
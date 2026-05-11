const fs = require('fs');
const Promise = require('promise');
const Papa = require('papaparse');

const source = '../Data/worldcities.csv';
const target = '../Data/africa-1500-cities.csv';

fs.readFile(source, 'utf8', (err, data) => {
    if(err) {
        throw err;
    } else {
        Papa.parse(data, {
            complete: process,
            header: true
        });
    }
})

function process(results) {
    const data = results.data.filter(d => d.continent == 'Africa');
    writeFile(Papa.unparse(data));
}

function writeFile(data) {
    fs.writeFile(target, data, (err) => {
        if(err) throw err;
        console.log('Done')
    });
}
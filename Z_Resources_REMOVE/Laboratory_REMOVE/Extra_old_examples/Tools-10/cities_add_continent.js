const fs = require('fs');
const Promise = require('promise');
const Papa = require('papaparse');

const source1 = '../Data/worldcities.csv';
const source2 = '../Data/un_regions.csv';
const target = '../Data/worldcities_new.csv';

const files = [source1, source2].map(f => {
    return new Promise((resolve, reject) => {
        fs.readFile(f, 'utf8', (err, data) => {
            if(err) {
                reject(err)
            } else {
                Papa.parse(data, {
                    complete: function(results) {
                        resolve(results.data)
                    },
                    header: true
                });
            }
        })
    })
})

Promise.all(files).then(data => {
    const newData = [];
    const nothing = [];
    const matches = [];

    const cities = data[0];
    const regions = data[1];

    cities.forEach(function(c) {
        let match = false;
        regions.forEach(function(r) {
            if (r.Code == c.iso3) {
                match = true;
                if(!c.continent) {
                    c.continent = r.Continent;
                    newData.push(r.Country);
                } else {
                    nothing.push(r.Country);
                    c.continent = 'Unknown'
                }
            }
        });
        if(!match) {
            matches.push(c.iso3);
            c.continent = 'Unmatched'
        }
    });
    
    console.log("NO MATCHES", matches.length);
    console.log("NEWDATA", newData.length);
    console.log("NOTHING size", nothing.length);

    writeFile(Papa.unparse(cities));
});

function writeFile(data) {
    fs.writeFile(target, data, (err) => {
        if(err) throw err;
        console.log('Done')
    });
}
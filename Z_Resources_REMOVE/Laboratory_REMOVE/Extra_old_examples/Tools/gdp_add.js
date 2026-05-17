const fs = require('fs');
const Promise = require('promise');
const Papa = require('papaparse');

const source1 = '../Data/gdp_per_capita_worldbank.csv';
const source2 = '../Data/un_regions.csv';
const target = '../Data/un_regions_gdp.csv';

const files = [source1, source2].map(f => {
    return new Promise((resolve, reject) => {
        fs.readFile(f, 'utf8', (err, data) => {
            if(err) {
                console.log(err)
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

    const migrations = data[0];
    const populations = data[1];

    migrations.forEach(function(m) {
        let match = false;
        populations.forEach(function(p) {
            if (p.Code == m.Code) {
                match = true;
                if(!p.GDP_2017) {
                    p.GDP_2017 = m["2017"];
                    newData.push(m["2017"]);
                } else {
                    nothing.push(p.Code);
                }
            }
        });
        if(!match) {
            matches.push(m.Code);
        }
    });
    
    console.log("NO MATCHES", matches);
    console.log("NEWDATA", newData);
    console.log("NOTHING size", nothing.length);

    writeFile(Papa.unparse(populations));
});

function writeFile(data) {
    fs.writeFile(target, data, (err) => {
        if(err) throw err;
        console.log('Done')
    });
}
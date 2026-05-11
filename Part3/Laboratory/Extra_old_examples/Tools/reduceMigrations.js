const fs = require('fs');
const Promise = require('promise');
const Papa = require('papaparse');

const source1 = '../Data/migration_2017.csv';
const source2 = '../Data/un_regions.csv';
const target = '../Data/migrations_2017_pop.csv';

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
    const changes = [];
    const newData = [];
    const nothing = [];
    const matches = [];

    const migrations = data[0];
    const populations = data[1];

    migrations.forEach(function(m) {
        let match = false;
        populations.forEach(function(p) {
            if (p.Country == m.Destination) {
                match = true;
                if(!m.Population) {
                    m.Population = +p.Pop_2016;
                    newData.push(p.Country);
                } else if (m.Population != p.Pop_2016) {
                    m.DIFF = +p.Pop_2016 - +m.Population;
                    m.Population = p.Pop_2016;
                    changes.push(p.Country + ": " + m.DIFF);
                } else {
                    nothing.push(p.Country);
                }
            }
        });
        if(!match) {
            matches.push(p.Country);
        }
    });
    
    console.log("NO MATCHES", matches);
    console.log("CHANGES", changes);
    console.log("NEWDATA", newData);
    console.log("NOTHING size", nothing.length);

    writeFile(Papa.unparse(migrations));
});

function writeFile(data) {
    fs.writeFile(target, data, (err) => {
        if(err) throw err;
        console.log('Done')
    });
}
// load un_gdp_2024.csv and un_regions_gdp.csv

const Papa = require('papaparse');
const fs = require('fs');

const source1 ='data/codes.csv'; // copy from
const source2 = 'data/migrations_2024_new.csv';    // change

const target = 'data/migrations_2024_new_iso.csv'// 'data/un_gdp_with_regions.csv'; // save

const files = [source1, source2].map(f => {
    return new Promise((resolve, reject) => {
        fs.readFile(f, 'utf8', (err, data) => {
            if(err) {
                reject(err)
            }else {
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

    console.log("File1", data[0])
    console.log("File2", data[1])

    const newDataDst = [];
    const newDataOrg = [];

   data[0].forEach(function(d) { // codes.csv
        data[1].forEach(function(e) { // migrations_2024_new.csv
            if (+e.DestCode === +d['country-code']) {
                e.DestCodeA3 = d.alpha3;
                newDataDst.push(e.Destination);
            }
            if (+e.OrigCode === +d['country-code']) {
                e.OrigCodeA3 = d.alpha3;
                newDataOrg.push(e.Origin);
            }
            if(e.Origin === 'Others') {
                e.OrigCodeA3 = '###';
                newDataOrg.push(e.Origin);
            }
            if(e.Destination === 'Others') {
                e.DestCodeA3 = '###';
                newDataOrg.push(e.Origin);
            }
        });
    });

    console.log("NEWDATA-Orig", new Set(newDataOrg));
    console.log("NEWDATA-Dest", new Set(newDataDst));

    writeFile(Papa.unparse(data[1]));
});

function writeFile(data) {
    fs.writeFile(target, data, (err) => {
        if(err) throw err;
        console.log('Done')
    });
}
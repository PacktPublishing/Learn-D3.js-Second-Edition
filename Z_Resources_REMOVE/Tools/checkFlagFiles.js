// load the data/codes.csv file, which are named with an alpha2 code,
// and use it to rename each file in data/flags with the corresponding alpha3 code

const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

const source = 'data/un_gdp.csv';
const flags = 'data/flags';

const p = new Promise((resolve, reject) => {
    fs.readFile(source, 'utf8', (err, data) => {
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
}).then(data => {
    const codesInFiles = fs.readdirSync(flags)
                                   .map(f => f.split('.')[0])
                                   .filter(f => f.length === 3);

    const noFileWithCode = new Set();
    const noCodeInCSV = [];

    data.forEach(d => {
        if(!codesInFiles.includes(d.Code)) {
            noFileWithCode.add(d.Country);
        }
    });
    codesInFiles.forEach(c => {
        if(!data.find(d => d.Code === c)) {
            noCodeInCSV.push(c);
        }
    });

    console.log("No file with code", noFileWithCode);
    console.log("No code in CSV", noCodeInCSV.length, noCodeInCSV);
});
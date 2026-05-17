// load the data/codes.csv file, which are named with an alpha2 code,
// and use it to rename each file in data/flags with the corresponding alpha3 code

const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

const source = 'data/codes.csv';
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
    const files = fs.readdirSync(flags);
    const codes = data.reduce((acc, d) => {
        acc[d.alpha2] = d.alpha3;
        return acc;
    }, {});

    const notChanged = [];

    files.forEach(f => {
        const code = f.split('.')[0].toUpperCase();
        const newCode = codes[code]

        const oldPath = path.join(flags, f);
        const newPath = newCode ? path.join(flags, `${newCode}.png`) : oldPath;

        console.log(newPath)

        if(newCode) {
            fs.renameSync(oldPath, newPath);
        } else {
            notChanged.push(oldPath);
        }

    });

    console.log("Not changed", notChanged.length, notChanged);
});
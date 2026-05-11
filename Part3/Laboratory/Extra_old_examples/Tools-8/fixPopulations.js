const fs = require('fs');
const Promise = require('promise');
const Papa = require('papaparse');

const source1 = '../Data/un_regions.csv';
const source2 = '../Data/world_un.csv';
const target = '../Data/un_regions.csv';

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

    const changes = [];
    const newData = [];
    const nothing = [];

    data[0].forEach(function(d) {
        data[1].forEach(function(e) {
            if (d.Country == e.Country) {
                if(e.Pop_2016 == '') {
                    e.Pop_2016 = +d.Pop_2016;
                    newData.push(d.Country);
                } else if (e.Pop_2016 != d.Pop_2016) {
                    e.DIFF = +d.Pop_2016 - +e.Pop_2016;
                    e.Pop_OLD = e.Pop_2016;
                    e.Pop_2016 = d.Pop_2016;
                    changes.push(d.Country + ": " + e.DIFF);
                } else {
                    nothing.push(d.Country);
                }
            }
        });
    });
    
    console.log("CHANGES", changes);
    console.log("NEWDATA", newData);
    console.log("NOTHING size", nothing.length);

    //writeFile(Papa.unparse(data[1]));
});

function writeFile(data) {
    fs.writeFile(target, data, (err) => {
        if(err) throw err;
        console.log('Done')
    });
}
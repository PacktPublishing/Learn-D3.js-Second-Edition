const Papa = require("papaparse");
const fs = require("fs");

const input = "../Data/hdi.csv";
const output = "../Data/hdi-year-rows.csv";

fs.readFile(input, function (err, data) {
   if (err) return console.error(err);
   parse(data.toString());
});

function parse(csv) {
    const data = Papa.parse(csv, {
        header: true,
        dynamicTyping: true
    });
    format(data.data);
}

function format(countries) {
    const entries = [];
    countries.forEach(country => {
        for(property in country) {
            const entry = {};
            if(!isNaN(property)) {
                entry.date  = property + "-01-01";
                entry.name  = country.Country.trim();
                entry.value = country[property] == null ? 0 : country[property];
                entries.push(entry);
            }
        }
    });
    unparse(entries);
}

function unparse(json) {
    const csv = Papa.unparse(json);
    save(csv);
}

function save(data) {
    fs.writeFile(output, data, function (err) {
        if (err) return console.error(err);
        console.log("File " + output + " was saved.");
    });
}
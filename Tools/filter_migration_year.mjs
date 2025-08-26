// Node.js script to filter migrations based on a specific pattern
// Remove rows where OrigCode is one of [900,1834,1829,901,902,941,934,948,1636,5503,5504,1503,1859,1517,1501,1500,903,910,908,926,922]

const source = 'data/migrations_2024_plus.csv';
const target = 'data/migrations_2024.csv';

// Write a script to load and parse the migrations_2024_plus.csv file, using d3
import fs from 'fs';
import * as d3 from 'd3';

fs.readFile(source, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    const rows = d3.dsvFormat(",").parse(data, row => {
        const newRow = {};
            for (const key in row) {
                if (key.startsWith('y') && key !== 'y2024' || key === 'Coverage' || key === 'Datatype')
                    continue;
                if (key === 'y2024') {
                    newRow.Immigrants = +row[key];
                } else {
                    newRow[key] = Number(row[key]) ? +row[key] : row[key]; // convert numeric fields to numbers
                }
            }
            return newRow;
    });

    console.log('Rows:', rows.length);

    // Remove asterisks (*) from the 'Origin' and 'Destination' fields
    // Replace the following Strings with the corresponding short name
    const replacements = {
        'United States of America': 'USA',
        'United Kingdom': 'UK',
        'Russian Federation': 'Russia',
        'Czech Republic': 'Czechia',
        'Republic of Korea': 'South Korea',
        'Dem. People\'s Republic of Korea': 'North Korea',
        'Democratic Republic of the Congo': 'DR Congo',
        'Republic of the Congo': 'Congo',
        'Viet Nam': 'Vietnam',
        'Bolivia (Plurinational State of)': 'Bolivia',
        'Iran (Islamic Republic of)': 'Iran',
        'Lao People\'s Democratic Republic': 'Laos',
        'Syrian Arab Republic': 'Syria',
        'Venezuela (Bolivarian Republic of)': 'Venezuela',
        'Republic of Moldova': 'Moldova',
        'North Macedonia': 'Macedonia',
        'United Republic of Tanzania': 'Tanzania',
        'State of Palestine': 'Palestine',
        'China, Hong Kong SAR': 'Hong Kong',
        'China, Macao SAR': 'Macao',
        'China, Taiwan Province of China': 'Taiwan',
        'United Arab Emirates': 'UAE',
        'Brunei Darussalam': 'Brunei',
        'Micronesia (Fed. States of)': 'Fed. States of Micronesia',
    };
    rows.forEach(row => {
        if (row.Origin) {
            row.Origin = row.Origin.replace('*', '').trim();
            if (replacements[row.Origin]) {
                row.Origin = replacements[row.Origin];
            }
        }
        if (row.Destination) {
            row.Destination = row.Destination.replace('*', '').trim();
            if (replacements[row.Destination]) {
                row.Destination = replacements[row.Destination];
            }
        }
    });

    const csvContent = d3.csvFormat(rows);

    fs.writeFile(target, csvContent, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('Filtered data written to', target);
        }
    });
});
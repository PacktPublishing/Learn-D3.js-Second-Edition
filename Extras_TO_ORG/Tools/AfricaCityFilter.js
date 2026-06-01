// Load the CSV file, parse it usng PapaParse, and filter it to include only cities in Africa
// Get the continent splitting the "timezone" column - the continent is before the "/" character
// Save the result in the output file

import fs from 'fs';
import Papa from 'papaparse';

const dataFile = "../data/world/cities1000.csv";
const outputFile = "../StepByStep/Step11/data/africa-cities.csv";

fs.readFile(dataFile, 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }

    const parsedData = Papa.parse(data, { header: true });
    const cities = parsedData.data;

    const filteredCities = cities.filter(city => {
        const timezone = city.timezone;
        const continent = timezone.split('/')[0];
        return (continent === "Africa");
    });

    const csvOutput = Papa.unparse(filteredCities);
    fs.writeFile(outputFile, csvOutput, 'utf8', (err) => {
        if (err) {
            console.error("Error writing file:", err);
        } else {
            console.log(`Filtered data saved to ${outputFile}`);
        }
    });
});
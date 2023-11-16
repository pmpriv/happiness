import mappings from "./country-name-to-iso-map.json" assert { type: 'json' };
import iso from "./countries-iso.json" assert { type: 'json' };
import { readFileSync, writeFileSync } from "fs";

const files = ['public/data/2018.json', 'public/data/2019.json'];

const countriesA3toA2 = new Map(
    iso.map(c => [c["alpha-3"], c["alpha-2"]])
);

/** Read the file, attach ISO_A3 and save it */
function processFile(filepath) {
    const raw = readFileSync(filepath);
    const data = JSON.parse(raw);
    const newData = data.map(r => processRecord(r));
    writeFileSync(filepath, JSON.stringify(newData, null));
}

function processRecord(record) {
    const name = record.Countryorregion;
    const a3Mapping = mappings[name];
    if (!a3Mapping) {
        throw new Error(`Couldn't find alpha-3 mapping for ${name}`);
    }
    const a2Mapping = countriesA3toA2.get(a3Mapping);
    if (!a2Mapping) {
        console.log(`Couldn't find alpha-2 mapping for ${name}: ${a3Mapping}`);
    }
    return { ...record, ISO_A3: a3Mapping, ISO_A2: a2Mapping };
}

for (const file of files) {
    processFile(file);
}

const jose = require("jose")
const fs = require("fs")

if (!process.argv[2]) {
    console.error("Please provide a directory name `node jwk.js <directory>`")
    process.exit(1);
}

const directory = process.argv[2];
const jwkBuffer = fs.readFileSync(`${directory}/${directory}-jwk.json`);
const jwk = JSON.parse(jwkBuffer);

const x5c = fs.readFileSync(`${directory}/${directory}-cert.pem`)
jwk.x5c = [x5c.toString("utf8").replace(/\n/g, '').replace('-----BEGIN CERTIFICATE-----', '').replace('-----END CERTIFICATE-----', '')];

jose.calculateJwkThumbprint(jwk).then(function (key) {
    jwk.x5t = key;
    fs.writeFileSync(`${directory}/${directory}-jwk-with-x5t.json`, Buffer.from(JSON.stringify(jwk)));
})

console.log(`check ${directory}/${directory}-jwk-with-x5t.json`)



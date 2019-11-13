const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const util = require("util");

const leagues = yaml.safeLoad(
    fs.readFileSync(path.join("fifa19", "FIFA19Teams.yml"))
);

// console.log(util.inspect(leagues, false, null, true));

const teams = [];
for (const league of leagues) {
    for (let team of league.teams) {
        teams.push(team);
    }
}

// console.log(teams.length);
for (let ii = 0; ii < 32; ii++) {
    console.log(teams[Math.floor(Math.random() * teams.length)]);
}

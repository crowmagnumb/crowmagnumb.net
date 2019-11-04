const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const util = require("util");

const teams = yaml.safeLoad(
    fs.readFileSync(path.join("fifa19", "FIFA19Teams.yml"))
);

console.log(util.inspect(teams, false, null, true));

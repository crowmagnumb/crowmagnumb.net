// node make_groups.js --maxteams 20 --groups 1 --include "United States"

const utils = require("./utils");
const argv = require("yargs").argv;

const matches = utils.makeMatches(argv.m);
console.log(matches);
console.log(matches.length);

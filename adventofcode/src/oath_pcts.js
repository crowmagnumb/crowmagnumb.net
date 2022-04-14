"use strict";
exports.__esModule = true;
var fs = require("fs");
var readline = require("readline");
var oath_utils_1 = require("./oath_utils");
fs.readFile("pcts.json", "utf8", function (err, data) {
    if (err) {
        console.error(err);
        return;
    }
    var pctsArr = JSON.parse(data);
    process.stdout.write("Enter <attack warbands> <defense dice> <defense warbands>, or 'q' to quit.\n");
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    function prompt() {
        rl.question("> ", function (value) {
            if (value === "q") {
                process.exit();
            }
            var values = value.split(" ");
            // console.log(values);
            var attackWarbands;
            if (values.length > 0) {
                attackWarbands = parseInt(values[0]);
            }
            else {
                attackWarbands = 0;
            }
            var defenseDice;
            if (values.length > 1) {
                defenseDice = parseInt(values[1]);
            }
            else {
                defenseDice = 0;
            }
            var defenseWarbands;
            if (values.length > 2) {
                defenseWarbands = parseInt(values[2]);
            }
            else {
                defenseWarbands = 0;
            }
            if (attackWarbands < 1 || defenseDice < 1) {
                process.stdout.write("Must have at least one attack and one defense die.\n");
                prompt();
                return;
            }
            // console.log(attackWarbands, defenseDice, defenseWarbands);
            var pcts;
            if (attackWarbands > 10 ||
                defenseDice > 10 ||
                defenseWarbands > 10 ||
                attackWarbands < 1 ||
                defenseDice < 1) {
                pcts = (0, oath_utils_1.calcPercents)(attackWarbands, defenseDice, defenseWarbands);
            }
            else {
                pcts =
                    pctsArr[attackWarbands - 1][defenseDice - 1][defenseWarbands];
            }
            process.stdout.write(pcts.map(function (pct, index) { return index + ": " + pct; }).join("  ") + "\n");
            prompt();
        });
    }
    prompt();
});

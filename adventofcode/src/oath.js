"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var fs = require("fs");
var defenseFaces = [
    {},
    {},
    { shields: 1 },
    { shields: 1 },
    { shields: 2 },
    { doubles: true },
];
var attackFaces = [
    { swords: 0.5 },
    { swords: 0.5 },
    { swords: 0.5 },
    { swords: 1 },
    { swords: 1 },
    { swords: 2, skulls: 1 },
];
function rollIndex() {
    return Math.floor(Math.random() * 6);
}
function rollDefense(num) {
    var shields = 0;
    var doubles = 0;
    for (var ii = 0; ii < num; ii++) {
        var roll = defenseFaces[rollIndex()];
        shields += roll.shields || 0;
        if (roll.doubles) {
            doubles++;
        }
    }
    return (shields *= Math.pow(2, doubles));
}
function rollAttack(num) {
    var swords = 0;
    var skulls = 0;
    for (var ii = 0; ii < num; ii++) {
        var roll = attackFaces[rollIndex()];
        swords += roll.swords || 0;
        skulls += roll.skulls || 0;
    }
    return { swords: Math.floor(swords), skulls: skulls };
}
function percents(attackWarbands, defenseDice, defenseWarbands, iters) {
    if (iters === void 0) { iters = 10000000; }
    var count = [];
    for (var ii = 0; ii <= attackWarbands; ii++) {
        count.push(0);
    }
    for (var ii = 0; ii < iters; ii++) {
        var attack = rollAttack(attackWarbands);
        var defense = rollDefense(defenseDice) + defenseWarbands;
        var result = attack.swords - defense;
        for (var jj = 0; jj <= attackWarbands; jj++) {
            if (result + jj - attack.skulls > 0) {
                count[jj]++;
            }
        }
    }
    return count.map(function (num) { return Math.round((num * 1000) / iters) / 10; });
}
function score(attackWarbands, defenseDice, defenseWarbands) {
    var pcts = percents(attackWarbands, defenseDice, defenseWarbands);
    console.log.apply(console, __spreadArray([attackWarbands,
        defenseDice,
        defenseWarbands], pcts.map(function (pct) { return pct.toFixed(1); })
    // ...count.map((num, index) => `${index}: ${(num / iters).toFixed(3)}`)
    , false));
}
// score(5, 2, 1);
// score(4, 2, 1);
// score(3, 2, 1);
// score(2, 2, 1);
// score(1, 2, 1);
// score(5, 3, 2);
// score(5, 3, 1);
// score(5, 3, 0);
// score(4, 3, 1);
// score(3, 3, 1);
// score(2, 3, 1);
// score(1, 3, 1);
// score(1, 1, 1);
// score(2, 1, 1);
// score(3, 1, 1);
// score(4, 1, 1);
//
// Note: awb starts at zero so that array storage is more efficient BUT
// you cannot make an attack with zero warbands. So zero actually means 1 warband.
// See the (awb + 1) when calling percents. Same with dfd, there is always at least one.
//
var pcts = [];
for (var awb = 0; awb <= 9; awb++) {
    pcts[awb] = [];
    for (var dfd = 0; dfd <= 9; dfd++) {
        pcts[awb][dfd] = [];
        for (var dwb = 0; dwb <= 10; dwb++) {
            process.stdout.write((awb + " - " + dfd + " - " + dwb).padEnd(50) + "\r");
            pcts[awb][dfd][dwb] = percents(awb + 1, dfd + 1, dwb);
            // console.log(awb, dfd, dwb, pcts[awb][dfd][dwb]);
        }
    }
}
fs.writeFileSync("pcts.json", JSON.stringify(pcts));

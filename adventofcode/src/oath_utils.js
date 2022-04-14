"use strict";
exports.__esModule = true;
exports.calcPercents = void 0;
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
function calcPercents(attackWarbands, defenseDice, defenseWarbands, iters) {
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
exports.calcPercents = calcPercents;

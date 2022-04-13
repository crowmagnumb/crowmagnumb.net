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
fs.readFile("pcts.json", "utf8", function (err, data) {
    if (err) {
        console.error(err);
        return;
    }
    var pcts = JSON.parse(data);
    var score = function (attackWarbands, defenseDice, defenseWarbands) {
        console.log.apply(console, __spreadArray([attackWarbands,
            defenseDice,
            defenseWarbands], pcts[attackWarbands - 1][defenseDice][defenseWarbands]
        // ...count.map((num, index) => `${index}: ${(num / iters).toFixed(3)}`)
        , false));
    };
    score(5, 2, 1);
    score(4, 2, 1);
    score(3, 2, 1);
    score(2, 2, 1);
    score(1, 2, 1);
    score(5, 3, 2);
    score(5, 3, 1);
    score(5, 3, 0);
    score(4, 3, 1);
    score(3, 3, 1);
    score(2, 3, 1);
    score(1, 3, 1);
    score(1, 1, 1);
    score(2, 1, 1);
    score(3, 1, 1);
    score(4, 1, 1);
});

const fs = require("fs");
const path = require("path");
const showdown = require("showdown");

const converter = new showdown.Converter({ tables: true });

exports.sequence = function (N) {
    return Array.from(new Array(N), (val, index) => index);
};

exports.getFileDir = function (category, key) {
    return path.join(category, key);
};

exports.getFilePath = function (category, key, filename) {
    return path.join(this.getFileDir(category, key), filename);
};

exports.markdown2Html = function (markdown) {
    return converter.makeHtml(markdown);
};

exports.writeHtml = function (bodyInnerHTML, outputFile) {
    fs.writeFile(
        outputFile,
        `<html><head><link type="text/css" rel="stylesheet" href="../../github.css"></link><link type="text/css" rel="stylesheet" href="../../fifa.css"></link></head><body>\n${bodyInnerHTML}</body></html>`,
        (err) => {
            if (err) {
                throw err;
            }
        }
    );
};

exports.getMatchFile = function (category, key) {
    return this.getFilePath(category, key, "groups.json");
};

exports.getTeamsFile = function (category, key) {
    return this.getFilePath(category, key, "teams.csv");
};

exports.getTeams = function (category, key) {
    return new Promise((resolve, reject) => {
        fs.readFile(this.getTeamsFile(category, key), "utf8", function (
            err,
            contents
        ) {
            if (err) {
                reject(err);
            }

            const lines = contents.split("\n").filter((line) => line !== "");
            lines.splice(0, 1);

            let teams = lines.map((line) => {
                const vals = line.split(",");
                let rating;
                if (vals.length >= 2) {
                    rating = parseFloat(vals[1]).toFixed(1);
                } else {
                    rating = 0;
                }
                let group;
                if (vals.length >= 3) {
                    group = parseInt(vals[2]);
                } else {
                    group = null;
                }
                return {
                    name: vals[0],
                    rating,
                    group,
                };
            });

            resolve(teams);
        });
    });
};

exports.getSortedTeams = function (category, key) {
    return this.getTeams(category, key).then((teams) => {
        teams.sort((a, b) => {
            return b.rating - a.rating;
        });
        return teams;
    });
};

exports.getTeamMap = function (category, key) {
    return this.getTeams(category, key).then((teams) => {
        let teamMap = new Map();
        for (const team of teams) {
            teamMap.set(team.name, team);
        }
        return teamMap;
    });
};

exports.makeMatches = function (num) {
    let isOdd = num % 2;

    let seq = this.sequence(num);

    let size;
    let half;
    if (isOdd) {
        // seq.unshift(-1);
        // seq.push(seq.shift());
        size = num;
        half = (num + 1) / 2;
        for (let ii = 0; ii < half; ii++) {
            seq.unshift(seq.pop()); // make it so that 0 plays 1 last
        }
    } else {
        seq.shift(); // remove the 0
        seq.unshift(seq.pop()); // make it so that 0 plays 1 last
        size = num - 1;
        half = num / 2;
    }

    const matches = [];
    for (let ii = 0; ii < size; ii++) {
        if (!isOdd) {
            matches.push([0, seq[0]]);
        }
        for (let jj = 1; jj < half; jj++) {
            a = seq[jj];
            b = seq[size - jj];
            if (a !== b && a !== -1 && b !== -1) {
                matches.push([a, b]);
            }
        }
        // seq.push(seq.shift());
        seq.unshift(seq.pop());
    }
    return matches;
};

// exports.makeMatchesOLD = function(num) {
//     //
//     // I want to generate an algorithm that creates the below. I know
//     // how to write it but I don't want to do that right now so I'm hard-coding
//     // the ones I need. Any others will be a bit funny due to the first
//     // algo I tried. But I won't be any number above 6 right now so...
//     //
//     if (num === 3) {
//         return [[0, 2], [0, 1], [1, 2]];
//     } else if (num === 4) {
//         return [[0, 3], [1, 2], [0, 2], [1, 3], [0, 1], [2, 3]];
//     } else if (num === 5) {
//         return [
//             [0, 4],
//             [1, 3],
//             [2, 4],
//             [0, 3],
//             [1, 2],
//             [0, 2],
//             [1, 4],
//             [3, 4],
//             [0, 1],
//             [2, 3]
//         ];
//     } else if (num === 6) {
//         return [
//             [0, 5],
//             [1, 4],
//             [2, 3],
//             [0, 4],
//             [1, 5],
//             [0, 2],
//             [3, 5],
//             [1, 3],
//             [2, 4],
//             [0, 3],
//             [1, 2],
//             [4, 5],
//             [0, 1],
//             [2, 5],
//             [3, 4]
//         ];
//     }
//     const matches = [];
//     for (const ii of this.sequence(num)) {
//         for (const jj of this.sequence(num - ii)) {
//             jval = jj + ii;
//             if (ii !== jval) {
//                 matches.push([ii, jval]);
//             }
//         }
//     }
//     return matches.sort((a, b) => {
//         const val0 = b[0] - a[0];
//         const val1 = b[1] - a[1];
//         if (val1 - val0 === 0) {
//             return b[1] - a[1];
//         }
//         return val1 - val0;
//     });
// };

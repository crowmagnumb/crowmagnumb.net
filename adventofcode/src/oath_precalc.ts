import * as fs from "fs";
import { calcPercents } from "./oath_utils";

// function score(
//     attackWarbands: number,
//     defenseDice: number,
//     defenseWarbands: number
// ) {
//     const pcts = calcPercents(attackWarbands, defenseDice, defenseWarbands);
//     console.log(
//         attackWarbands,
//         defenseDice,
//         defenseWarbands,
//         ...pcts.map((pct) => pct.toFixed(1))
//     );
// }

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
let pcts: number[][][][] = [];
for (let awb = 0; awb <= 9; awb++) {
    pcts[awb] = [];
    for (let dfd = 0; dfd <= 9; dfd++) {
        pcts[awb][dfd] = [];
        for (let dwb = 0; dwb <= 10; dwb++) {
            process.stdout.write(`${awb} - ${dfd} - ${dwb}`.padEnd(50) + "\r");
            pcts[awb][dfd][dwb] = calcPercents(awb + 1, dfd + 1, dwb);
            // console.log(awb, dfd, dwb, pcts[awb][dfd][dwb]);
        }
    }
}

fs.writeFileSync("pcts.json", JSON.stringify(pcts));

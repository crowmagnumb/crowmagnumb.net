import * as fs from "fs";

type DefenseValue = {
    shields?: number;
    doubles?: boolean;
};

type AttackValue = {
    swords?: number;
    skulls?: number;
};

const defenseFaces: DefenseValue[] = [
    {},
    {},
    { shields: 1 },
    { shields: 1 },
    { shields: 2 },
    { doubles: true },
];

const attackFaces: AttackValue[] = [
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

function rollDefense(num: number) {
    let shields = 0;
    let doubles = 0;
    for (let ii = 0; ii < num; ii++) {
        const roll = defenseFaces[rollIndex()];

        shields += roll.shields || 0;
        if (roll.doubles) {
            doubles++;
        }
    }
    return (shields *= Math.pow(2, doubles));
}

function rollAttack(num: number) {
    let swords = 0;
    let skulls = 0;
    for (let ii = 0; ii < num; ii++) {
        const roll = attackFaces[rollIndex()];

        swords += roll.swords || 0;
        skulls += roll.skulls || 0;
    }
    return { swords: Math.floor(swords), skulls } as AttackValue;
}

function percents(
    attackWarbands: number,
    defenseDice: number,
    defenseWarbands: number,
    iters = 10000000
) {
    let count: number[] = [];
    for (let ii = 0; ii <= attackWarbands; ii++) {
        count.push(0);
    }
    for (let ii = 0; ii < iters; ii++) {
        const attack = rollAttack(attackWarbands);
        const defense = rollDefense(defenseDice) + defenseWarbands;
        const result = attack.swords - defense;

        for (let jj = 0; jj <= attackWarbands; jj++) {
            if (result + jj - attack.skulls > 0) {
                count[jj]++;
            }
        }
    }
    return count.map((num) => Math.round((num * 1000) / iters) / 10);
}

function score(
    attackWarbands: number,
    defenseDice: number,
    defenseWarbands: number
) {
    const pcts = percents(attackWarbands, defenseDice, defenseWarbands);
    console.log(
        attackWarbands,
        defenseDice,
        defenseWarbands,
        ...pcts.map((pct) => pct.toFixed(1))
        // ...count.map((num, index) => `${index}: ${(num / iters).toFixed(3)}`)
    );
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
let pcts: number[][][][] = [];
for (let awb = 0; awb <= 9; awb++) {
    pcts[awb] = [];
    for (let dfd = 0; dfd <= 9; dfd++) {
        pcts[awb][dfd] = [];
        for (let dwb = 0; dwb <= 10; dwb++) {
            process.stdout.write(`${awb} - ${dfd} - ${dwb}`.padEnd(50) + "\r");
            pcts[awb][dfd][dwb] = percents(awb + 1, dfd + 1, dwb);
            // console.log(awb, dfd, dwb, pcts[awb][dfd][dwb]);
        }
    }
}

fs.writeFileSync("pcts.json", JSON.stringify(pcts));

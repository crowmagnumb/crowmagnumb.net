import * as fs from "fs";

fs.readFile("pcts.json", "utf8", (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    let pcts = JSON.parse(data) as number[][][][];

    let score = (
        attackWarbands: number,
        defenseDice: number,
        defenseWarbands: number
    ) => {
        console.log(
            attackWarbands,
            defenseDice,
            defenseWarbands,
            ...pcts[attackWarbands - 1][defenseDice - 1][defenseWarbands]
            // ...count.map((num, index) => `${index}: ${(num / iters).toFixed(3)}`)
        );
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

    score(2, 1, 1);
    score(2, 2, 1);
    score(2, 3, 1);
    score(2, 4, 1);
    score(2, 4, 2);
    score(2, 5, 2);
});

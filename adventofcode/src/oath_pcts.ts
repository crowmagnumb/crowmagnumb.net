import * as fs from "fs";
import * as readline from "readline";
import { calcPercents } from "./oath_utils";

fs.readFile("pcts.json", "utf8", (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    let pctsArr = JSON.parse(data) as number[][][][];

    process.stdout.write(
        "Enter <attack warbands> <defense dice> <defense warbands>, or 'q' to quit.\n"
    );
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    function prompt() {
        rl.question("> ", (value: string) => {
            if (value === "q") {
                process.exit();
            }
            let values = value.split(" ");

            // console.log(values);
            let attackWarbands;
            if (values.length > 0) {
                attackWarbands = parseInt(values[0]);
            } else {
                attackWarbands = 0;
            }
            let defenseDice;
            if (values.length > 1) {
                defenseDice = parseInt(values[1]);
            } else {
                defenseDice = 0;
            }
            let defenseWarbands: number;
            if (values.length > 2) {
                defenseWarbands = parseInt(values[2]);
            } else {
                defenseWarbands = 0;
            }

            if (attackWarbands < 1 || defenseDice < 1) {
                process.stdout.write(
                    "Must have at least one attack and one defense die.\n"
                );
                prompt();
                return;
            }

            // console.log(attackWarbands, defenseDice, defenseWarbands);
            let pcts: number[];
            if (
                attackWarbands > 10 ||
                defenseDice > 10 ||
                defenseWarbands > 10 ||
                attackWarbands < 1 ||
                defenseDice < 1
            ) {
                pcts = calcPercents(
                    attackWarbands,
                    defenseDice,
                    defenseWarbands
                );
            } else {
                pcts =
                    pctsArr[attackWarbands - 1][defenseDice - 1][
                        defenseWarbands
                    ];
            }

            process.stdout.write(
                pcts.map((pct, index) => `${index}: ${pct}`).join("  ") + "\n"
            );
            prompt();
        });
    }

    prompt();
});

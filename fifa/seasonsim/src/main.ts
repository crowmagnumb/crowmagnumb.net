import { System } from "./System";

const NUM_DIVISIONS = 10;
const NUM_PLAYERS = 10000;
const NUM_LEVELS = 100;
const MAX_ITERS = 10000 * NUM_PLAYERS;
const LOG_INTERVAL = 100 * NUM_PLAYERS;
//
// General shape of division counts should have stabalized by
// now and so now at LOG_INTERVAL we collect stats for final output.
//
const STATS_START_ITER = 1000 * NUM_PLAYERS;

const uniformSkillDist = (id: number) => {
    return Math.floor(id / Math.floor(NUM_PLAYERS / NUM_LEVELS)) + 1;
};

let minSkill = Number.MAX_VALUE;
let maxSkill = 0;
const SIGMA = 0.3;
const A = SIGMA * Math.sqrt(2 * Math.PI);
const gaussianSkillDist = () => {
    let value = Math.random();
    // let skill = (1 / A) * Math.exp(-0.5 * (value - 0.5 / SIGMA) ** 2);
    let skill = 100 * SIGMA * Math.sqrt(-2 * Math.log(A * value));
    if (skill < minSkill) {
        minSkill = skill;
    }
    if (skill > maxSkill) {
        maxSkill = skill;
    }
    console.log(value, skill, minSkill, maxSkill);
    return skill;
};

let skillDist =
    process.argv.indexOf("--gaussian") >= 0
        ? gaussianSkillDist
        : uniformSkillDist;

let system = new System(NUM_DIVISIONS, NUM_PLAYERS, skillDist);

let statsCount = 0;
let stats: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

let report = () => {
    system.operateOnDivs((division) => {
        console.log(
            division.division,
            division.players.size,
            statsCount
                ? (stats[division.division - 1] / statsCount).toFixed(1)
                : "--",
            division.avgPlayerSkill().toFixed(1)
        );
    });
};

let iter = 0;
let done: boolean = false;
while (!done) {
    system.simulateRandomMatch();

    iter++;

    if (iter % LOG_INTERVAL == 0) {
        if (iter >= STATS_START_ITER) {
            statsCount++;
            system.operateOnDivs((division) => {
                stats[division.division - 1] =
                    stats[division.division - 1] + division.players.size;
            });
        }
        console.log(`\nInterval: ${iter}`);
        report();
    }
    if (iter > MAX_ITERS) {
        done = true;
    }
}

system.operateOnDivs((division) => {
    console.log(
        `${division.division},${(
            stats[division.division - 1] / statsCount
        ).toFixed(1)}`
    );
});

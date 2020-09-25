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

const playersPerLevel = Math.floor(NUM_PLAYERS / NUM_LEVELS);
const uniformSkillDist = (id: number) => {
    return id / playersPerLevel;
};

function gaussian(mean, stdev) {
    var y2;
    var use_last = false;
    return function () {
        var y1;
        if (use_last) {
            y1 = y2;
            use_last = false;
        } else {
            var x1, x2, w;
            do {
                x1 = 2.0 * Math.random() - 1.0;
                x2 = 2.0 * Math.random() - 1.0;
                w = x1 * x1 + x2 * x2;
            } while (w >= 1.0);
            w = Math.sqrt((-2.0 * Math.log(w)) / w);
            y1 = x1 * w;
            y2 = x2 * w;
            use_last = true;
        }

        var retval = mean + stdev * y1;
        if (retval > 0) return retval;
        return -retval;
    };
}

let gaussDist = gaussian(50, 20);

// let minSkill = Number.MAX_VALUE;
// let maxSkill = 0;
// let under10 = 0;
// let over100 = 0;
// let over90 = 0;
const gaussianSkillDist = () => {
    let skill = gaussDist();
    // if (skill < minSkill) {
    //     minSkill = skill;
    // }
    // if (skill > maxSkill) {
    //     maxSkill = skill;
    // }
    // if (skill < 10) {
    //     under10++;
    // }
    // if (skill > 100) {
    //     over100++;
    // }
    // if (skill > 90) {
    //     over90++;
    // }
    // console.log(skill, minSkill, maxSkill, under10, over90, over100);
    if (skill > 100) skill = 100;
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
        `${division.division} ${(
            stats[division.division - 1] / statsCount
        ).toFixed(1)}`
    );
});

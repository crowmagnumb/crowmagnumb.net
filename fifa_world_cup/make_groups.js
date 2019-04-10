const fs = require("fs");

const utils = require("./utils");

const NUM_GROUPS = 8;

function sequence(N) {
    return Array.from(new Array(N), (val, index) => index);
}

// function shuffle(array) {
//     var currentIndex = array.length,
//         temporaryValue,
//         randomIndex;
//
//     // While there remain elements to shuffle...
//     while (0 !== currentIndex) {
//         // Pick a remaining element...
//         randomIndex = Math.floor(Math.random() * currentIndex);
//         currentIndex -= 1;
//
//         // And swap it with the current element.
//         temporaryValue = array[currentIndex];
//         array[currentIndex] = array[randomIndex];
//         array[randomIndex] = temporaryValue;
//     }
//
//     return array;
// }

function makeRounds(num) {
    //
    // I want to generate an algorithm that creates the below. I know
    // how to write it but I don't want to do that right now so I'm hard-coding
    // the ones I need. Any others will be a bit funny due to the first
    // algo I tried. But I won't be any number above 6 right now so...
    //
    if (num === 3) {
        return [[0, 2], [0, 1], [1, 2]];
    } else if (num === 4) {
        return [[0, 3], [1, 2], [0, 2], [1, 3], [0, 1], [2, 3]];
    } else if (num === 5) {
        return [
            [0, 4],
            [1, 3],
            [2, 4],
            [0, 3],
            [1, 2],
            [0, 2],
            [1, 4],
            [3, 4],
            [0, 1],
            [2, 3]
        ];
    } else if (num === 6) {
        return [
            [0, 5],
            [1, 4],
            [2, 3],
            [0, 4],
            [1, 5],
            [0, 2],
            [3, 5],
            [1, 3],
            [2, 4],
            [0, 3],
            [1, 2],
            [4, 5],
            [0, 1],
            [2, 5],
            [3, 4]
        ];
    }
    const rounds = [];
    for (const ii of sequence(num)) {
        for (const jj of sequence(num - ii)) {
            jval = jj + ii;
            if (ii !== jval) {
                rounds.push([ii, jval]);
            }
        }
    }
    return rounds.sort((a, b) => {
        const val0 = b[0] - a[0];
        const val1 = b[1] - a[1];
        if (val1 - val0 === 0) {
            return b[1] - a[1];
        }
        return val1 - val0;
    });
}

fs.readFile("2019/teams.csv", "utf8", function(err, contents) {
    const lines = contents.split("\n").filter(line => line !== "");
    lines.splice(0, 1);

    const teams = lines.map(line => {
        const vals = line.split(",");
        return {
            team: vals[0],
            rating:
                Math.round(
                    (10 *
                        (parseInt(vals[1]) +
                            parseInt(vals[2]) +
                            parseInt(vals[3]))) /
                        3
                ) / 10
        };
    });

    teams.sort((a, b) => {
        return b.rating - a.rating;
    });

    // console.log(teams);

    const numTeams = teams.length;
    // const groupSize = Math.floor(numTeams / NUM_GROUPS);

    let pots = [];
    teams.forEach((team, index) => {
        pindex = Math.floor(index / NUM_GROUPS);
        if (pots.length < pindex + 1) {
            pots[pindex] = [];
        }
        pots[pindex].push(team);
    });

    // console.log(pots);

    //
    // Make random groups based on pots. Note: pots will not all be the same
    // size which will lead to not all groups being the same size.
    //
    let groups = [];
    for (let groupIndex of sequence(NUM_GROUPS)) {
        let group = [];
        groups.push(group);

        for (let potIndex of sequence(pots.length)) {
            let pot = pots[potIndex];
            if (pot.length === 0) {
                continue;
            }
            let index = Math.floor(Math.random() * pot.length);
            let team = pot[index];
            pots[potIndex].splice(index, 1);
            group.push(team);
        }
    }

    // console.log(groups);

    // Now automatially create rounds like the following using a sequence and some sort of
    // "all variations of a set" creator. And then randomize the matches. Then create the schedule from that
    // like in make_group_schedule.
    for (group of groups) {
        const rounds = makeRounds(group.length);
    }
});

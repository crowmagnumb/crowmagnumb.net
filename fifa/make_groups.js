//
// node make_groups.js > fifa19/xxx/groups.json
// node make_groups.js --maxteams 20 --groups 1 --include "United States"
// "fifa19/teams.csv"
//
const fs = require("fs");
const path = require("path");
const utils = require("./utils");

const argv = require("yargs")
    .default("groups", 8)
    .default("matchesper", 1)
    .alias("c", "category")
    .alias("k", "key")
    .alias("g", "groups")
    .alias("m", "matchesper")
    .alias("i", "include")
    .alias("t", "maxteams")
    // .alias("f", "teamsfile")
    .demandOption("key")
    .demandOption("category").argv;

let dir = utils.getFileDir(argv.category, argv.key);
// if (fs.existsSync(dir)) {
//     throw new Error("This key already exists.");
// }

// fs.mkdirSync(dir);
// fs.copyFileSync(argv.teamsfile, utils.getTeamsFile(argv.category, argv.key));

function addMatches(groups, matches) {
    for (let ii = 0; ii < groups.length; ii++) {
        let group = groups[ii];
        group.matches = group.matches.concat(matches[ii]);
    }
}

utils.getSortedTeams(argv.category, argv.key).then((sortedTeams) => {
    let teams;
    if (argv.maxteams) {
        teams = sortedTeams.slice(0, argv.groups * argv.maxteams);
        if (argv.include) {
            let included = teams.find((team) => {
                return team.name === argv.include;
            });
            if (!included) {
                let include = sortedTeams.find((team) => {
                    return team.name === argv.include;
                });
                if (include) {
                    teams[teams.length - 1] = include;
                }
            }
        }
    } else {
        teams = sortedTeams;
    }

    //
    // Check to see if our groups are pre-defined or if we are going to make them.
    // If the first team has its group pre-set then the requirement is that all teams
    // have their groups pre-set.
    //
    let groups = [];
    if (teams[0].group === null) {
        let pots = [];
        teams.forEach((team, index) => {
            pindex = Math.floor(index / argv.groups);
            if (pots.length < pindex + 1) {
                pots[pindex] = [];
            }
            pots[pindex].push(team.name);
        });

        //
        // Make random groups based on pots. Note: pots may not all be the same
        // size which will lead to not all groups being the same size.
        //
        for (let groupIndex of utils.sequence(argv.groups)) {
            const group = { teams: [], matches: [] };
            groups.push(group);

            for (let potIndex of utils.sequence(pots.length)) {
                let pot = pots[potIndex];
                if (pot.length === 0) {
                    continue;
                }
                let index = Math.floor(Math.random() * pot.length);
                let teamName = pot[index];
                pots[potIndex].splice(index, 1);
                group.teams.push(teamName);
            }
        }
    } else {
        for (const team of teams) {
            let group = groups[team.group];
            if (!group) {
                group = { teams: [], matches: [] };
                groups[team.group] = group;
            }
            group.teams.push(team.name);
        }
    }

    gmatches = groups.map((group) => {
        const matches = [];
        utils.makeMatches(group.teams.length).forEach((match) => {
            //
            // Decide on "home" team
            //
            let teamAIndex;
            let teamBIndex;
            if (Math.floor(Math.random() * 2) === 0) {
                teamAIndex = 0;
                teamBIndex = 1;
            } else {
                teamAIndex = 1;
                teamBIndex = 0;
            }
            let matchup = [];
            matchup[0] = {
                team: group.teams[match[teamAIndex]],
                isAI: false,
                score: null,
            };
            matchup[1] = {
                team: group.teams[match[teamBIndex]],
                isAI: false,
                score: null,
            };
            //
            // Determine who I am playing vs the AI.
            //
            matchup[Math.floor(Math.random() * 2)].isAI = true;
            matches.push(matchup);
        });
        return matches;
    });

    addMatches(groups, gmatches);

    if (argv.matchesper && argv.matchesper > 1) {
        ogmatches = gmatches.map((matches) => {
            return matches.map((matchup) => {
                //
                // Reverse the home/away and then change the isAI bits.
                //
                let omatchup = [
                    Object.assign({}, matchup[1]),
                    Object.assign({}, matchup[0]),
                ];
                omatchup[0].isAI = !omatchup[0].isAI;
                omatchup[1].isAI = !omatchup[1].isAI;
                return omatchup;
            });
        });
        for (let ii = 1; ii < argv.matchesper; ii++) {
            if (ii % 2) {
                addMatches(groups, ogmatches);
            } else {
                addMatches(groups, gmatches);
            }
        }
    }

    fs.writeFileSync(
        utils.getMatchFile(argv.category, argv.key),
        JSON.stringify(groups, null, 4)
    );
});

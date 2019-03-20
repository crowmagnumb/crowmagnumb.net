var fs = require("fs");

const rounds = [[[0, 3], [1, 2]], [[0, 2], [1, 3]], [[0, 1], [2, 3]]];

//
// TODO: Write CSV file that I can easily fill out to use update_group_standings.
//
fs.readFile("groups.json", "utf8", function(err, contents) {
    let lines = [];
    let csvLines = [];
    lines.push("# World Cup Group Matches");
    lines.push("|| Match | Final Score | Player Of The Match |");
    lines.push("|:---:|---|---|---|");

    const groups = JSON.parse(contents);
    rounds.forEach(round => {
        groups.forEach((group, groupIndex) => {
            round.forEach((game, index) => {
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
                let teamA = group[game[teamAIndex]];
                let teamB = group[game[teamBIndex]];
                //
                // Determine who I am playing vs the AI.
                //
                if (Math.floor(Math.random() * 2) === 0) {
                    teamA = `**${teamA}**`;
                } else {
                    teamB = `**${teamB}**`;
                }

                lines.push(
                    `|${String.fromCharCode(
                        65 + groupIndex
                    )}|${teamA} v. ${teamB}||`
                );
                csvLines.push(`${teamA},${teamB},,,`);
            });
        });
    });

    fs.writeFile(
        utils.getFilePath("group_schedule.md"),
        lines.join("\n"),
        err => {
            if (err) {
                throw err;
            }
        }
    );
    fs.writeFile(
        utils.getFilePath("group_matches.csv`"),
        csvLines.join("\n"),
        err => {
            if (err) {
                throw err;
            }
        }
    );
});

const fs = require("fs");
const utils = require("./utils");

function displayTeamName(match, index) {
    team = match[index];
    let display;
    if (team.isAI) {
        display = team.team;
    } else {
        display = `_${team.team}_`;
    }

    if (team.score != null) {
        let ii = index === 0 ? 1 : 0;
        if (match[ii].score < team.score) {
            display = `**${display}**`;
        }
    }
    return display;
}

function displayTeam(match, index) {
    team = match[index];
    return `${displayTeamName(match, index)}|${
        team.score === null ? "" : team.score
    }|${team.player ? team.player : ""}`;
}

fs.readFile(utils.getFilePath("groups.json"), "utf8", function(err, contents) {
    const groups = JSON.parse(contents);

    let maxMatches = 0;
    for (group of groups) {
        if (group.matches.length > maxMatches) {
            maxMatches = group.matches.length;
        }
    }

    let lines = [];
    lines.push("# World Cup Group Matches");
    lines.push("|| Team1 | Score | Player | Team2 | Score | Player |");
    lines.push("|:---:|---|---|---|---|---|---|");
    let index = 0;
    while (index < maxMatches) {
        groups.forEach((group, groupIndex) => {
            if (index < group.matches.length) {
                const match = group.matches[index];
                lines.push(
                    `|${String.fromCharCode(65 + groupIndex)}|${displayTeam(
                        match,
                        0
                    )}|${displayTeam(match, 1)}|`
                );
            }
        });
        index++;
    }
    utils.markdown2Html(
        lines.join("\n"),
        utils.getFilePath("group_matches.html")
    );
});

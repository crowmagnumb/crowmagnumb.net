const fs = require("fs");
const utils = require("./utils");

const argv = require("yargs")
    .alias("k", "key")
    .demandOption("key").argv;

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

const groupSort = (a, b) => {
    if (a.pts === b.pts && a.gd === b.gd && a.gf === b.gf) {
        return 0;
    }

    if (a.pts > b.pts) {
        return -3;
    }

    if (a.pts < b.pts) {
        return 3;
    }

    if (a.gd > b.gd) {
        return -2;
    }

    if (a.gd < b.gd) {
        return 2;
    }

    if (a.gf > b.gf) {
        return -1;
    }

    return 1;
};

function groupStandings(group) {
    //
    // Seed the info map
    //
    const infoMap = new Map();
    for (const team of group.teams) {
        let info = {
            team,
            mp: 0,
            wins: 0,
            draws: 0,
            loses: 0,
            gf: 0,
            ga: 0,
            gd: 0,
            pts: 0
        };
        infoMap.set(team, info);
    }

    //
    // Ignore matches that haven't been recorded yet.
    //
    for (const match of group.matches.filter(
        match => match[0].score !== null
    )) {
        const info1 = infoMap.get(match[0].team);
        const info2 = infoMap.get(match[1].team);
        const score1 = match[0].score;
        const score2 = match[1].score;

        info1.mp++;
        info1.gf += score1;
        info1.ga += score2;
        info2.mp++;
        info2.gf += score2;
        info2.ga += score1;
        if (score1 > score2) {
            info1.wins++;
            info2.loses++;
        } else if (score2 > score1) {
            info2.wins++;
            info1.loses++;
        } else {
            info1.draws++;
            info2.draws++;
        }
    }

    for (const info of Array.from(infoMap.values())) {
        info.gd = info.gf - info.ga;
        info.pts = info.wins * 3 + info.draws;
    }

    const infos = Array.from(infoMap.values());
    infos.sort(groupSort);
    return infos;
}

function getMatches(groups) {
    let maxMatches = 0;
    for (group of groups) {
        if (group.matches.length > maxMatches) {
            maxMatches = group.matches.length;
        }
    }

    let lines = [];
    lines.push("# Group Matches");
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
    return utils.markdown2Html(lines.join("\n"));
}

function getStandings(groups) {
    let lines = [];
    lines.push("# Standings");
    groups.forEach((group, groupIndex) => {
        lines.push(`## Group ${String.fromCharCode(65 + groupIndex)}`);
        lines.push("| Team | MP | W | D | L | GF | GA | GD | Pts |");
        lines.push("|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|");

        for (const info of groupStandings(group)) {
            lines.push(
                `|${info.team}|${info.mp}|${info.wins}|${info.draws}|${
                    info.loses
                }|${info.gf}|${info.ga}|${info.gd}|${info.pts}|`
            );
        }
    });
    return utils.markdown2Html(lines.join("\n"));
}

fs.readFile(utils.getFilePath(argv.key, "groups.json"), "utf8", function(
    err,
    contents
) {
    const groups = JSON.parse(contents);

    const roman = argv.key.toUpperCase();
    const bodyInnerHTML = `<div style="border: 15px">
  <a href="bracket.html">Bracket</a>
  <h1 style="text-align: center">FIFA 19 World Cup ${roman}</h1>
  <div class="row">
    <div class="column" style="padding-right: 15px">
      ${getStandings(groups)}
    </div>
    <div class="column">
      ${getMatches(groups)}
    </div>
  </div>
</div>`;

    utils.writeHtml(bodyInnerHTML, utils.getFilePath(argv.key, "index.html"));
});

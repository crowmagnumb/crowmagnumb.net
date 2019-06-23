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
        display = `<span class="you">${team.team}</span>`;
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
    }`;
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

class TeamInfo {
    constructor(team) {
        this.team = team;
        this.mp = 0;
        this.wins = 0;
        this.draws = 0;
        this.loses = 0;
        this.gf = 0;
        this.ga = 0;
        this.gd = 0;
        this.pts = 0;
    }

    calc() {
        this.gd = this.gf - this.ga;
        this.pts = this.wins * 3 + this.draws;
    }
}

function incrementInfos(info1, score1, info2, score2) {
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

function calcStandings(infos) {
    for (const info of infos) {
        info.calc();
    }
    infos.sort(groupSort);
    return infos;
}

function groupStandings(group) {
    //
    // Seed the info map
    //
    const infoMap = new Map();
    for (const team of group.teams) {
        infoMap.set(team, new TeamInfo(team));
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

        incrementInfos(info1, score1, info2, score2);
    }

    return calcStandings(Array.from(infoMap.values()));
}

function yourStandings(groups) {
    let you = new TeamInfo("You");
    let ai = new TeamInfo("AI");

    for (const group of groups) {
        for (const match of group.matches.filter(
            match => match[0].score !== null
        )) {
            let yourscore;
            let aiscore;
            if (match[0].isAI) {
                yourscore = match[1].score;
                aiscore = match[0].score;
            } else {
                yourscore = match[0].score;
                aiscore = match[1].score;
            }

            incrementInfos(you, yourscore, ai, aiscore);
        }
    }
    return calcStandings([you, ai]);
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
    lines.push(
        `${groups.length > 1 ? "|" : ""}| Home | Score | Away | Score |`
    );
    lines.push(`${groups.length > 1 ? "|:---:" : ""}|---|---|---|---|`);
    let index = 0;
    while (index < maxMatches) {
        groups.forEach((group, groupIndex) => {
            if (index < group.matches.length) {
                const match = group.matches[index];
                lines.push(
                    `${
                        groups.length > 1
                            ? `|${String.fromCharCode(65 + groupIndex)}`
                            : ""
                    }|${displayTeam(match, 0)}|${displayTeam(match, 1)}|`
                );
            }
        });
        index++;
    }
    return utils.markdown2Html(lines.join("\n"));
}

function appendStandingsHeader(lines, title) {
    if (title) {
        lines.push(`## ${title}`);
    }
    lines.push("| Team | MP | W | D | L | GF | GA | GD | Pts |");
    lines.push("|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|");
}

function appendResults(lines, infos) {
    for (const info of infos) {
        lines.push(
            `|${info.team}|${info.mp}|${info.wins}|${info.draws}|${
                info.loses
            }|${info.gf}|${info.ga}|${info.gd}|${info.pts}|`
        );
    }
}

function getStandings(groups) {
    let lines = [];
    lines.push("# Standings");
    groups.forEach((group, groupIndex) => {
        appendStandingsHeader(
            lines,
            groups.length > 1
                ? `Group ${String.fromCharCode(65 + groupIndex)}`
                : null
        );
        appendResults(lines, groupStandings(group));
    });

    appendStandingsHeader(lines, "You vs. AI");
    appendResults(lines, yourStandings(groups));

    return utils.markdown2Html(lines.join("\n"));
}

fs.readFile(utils.getFilePath(argv.key, "groups.json"), "utf8", function(
    err,
    contents
) {
    const groups = JSON.parse(contents);

    const roman = argv.key.toUpperCase();
    const bodyInnerHTML = `<div style="border: 15px">
    ${groups.length > 1 ? '<a href="bracket.html">Bracket</a>' : ""}
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

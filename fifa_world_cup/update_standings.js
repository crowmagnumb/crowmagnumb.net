const fs = require("fs");
const utils = require("./utils");

const argv = require("yargs")
    .alias("k", "key")
    .alias("f", "teamsfile")
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
        this.lastFive = [null, null, null, null, null];
    }

    recordGame(us, them) {
        this.mp++;
        this.gf += us;
        this.ga += them;

        this.lastFive.shift();
        if (us > them) {
            this.wins++;
            this.lastFive.push("W");
        } else if (them > us) {
            this.loses++;
            this.lastFive.push("L");
        } else {
            this.draws++;
            this.lastFive.push("-");
        }
    }

    calc() {
        this.gd = this.gf - this.ga;
        this.pts = this.wins * 3 + this.draws;
    }
}

function incrementInfos(info1, score1, info2, score2) {
    info1.recordGame(score1, score2);
    info2.recordGame(score2, score1);
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
    for (const group of groups) {
        if (group.matches.length > maxMatches) {
            maxMatches = group.matches.length;
        }
    }

    let lines = [];
    lines.push(
        `${groups.length > 1 ? "|" : ""}| Home | Score | Away | Score | Note |`
    );
    lines.push(`${groups.length > 1 ? "|:---:" : ""}|---|---|---|---|---|`);
    let index = 0;

    let linebuilder = (group, groupIndex) => {
        if (index < group.matches.length) {
            const match = group.matches[index];
            lines.push(
                `${
                    groups.length > 1
                        ? `|${String.fromCharCode(65 + groupIndex)}`
                        : ""
                }|${displayTeam(match, 0)}|${displayTeam(match, 1)}|${match[0]
                    .note || ""}|`
            );
        }
    };

    while (index < maxMatches) {
        groups.forEach(linebuilder);
        index++;
    }

    return utils.markdown2Html(lines.join("\n"));
}

function appendStandingsHeader(lines, title, teamMap) {
    if (title) {
        lines.push(`## ${title}`);
    }
    lines.push(
        `||${
            teamMap ? " R |" : ""
        } Team | MP | W | D | L | GF | GA | GD | Pts | Last 5 |`
    );
    lines.push(
        `|:---:|${
            teamMap ? ":---:|" : ""
        }---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|`
    );
}

function appendResults(lines, infos, teamMap) {
    infos.forEach((info, index) => {
        let rating = null;
        if (teamMap) {
            rating = teamMap.get(info.team).rating;
        }
        let lastFive = info.lastFive
            .map(result => {
                let cssclass = "";
                switch (result) {
                    case "W":
                        cssclass = "win";
                        break;
                    case "L":
                        cssclass = "loss";
                        break;
                    case "-":
                        cssclass = "draw";
                        break;
                    default:
                        return "";
                }
                return `<span class="${cssclass}">${result}</span>`;
            })
            .join(" ");
        lines.push(
            `${index + 1}|${rating ? rating + "|" : ""}${info.team}|${
                info.mp
            }|${info.wins}|${info.draws}|${info.loses}|${info.gf}|${info.ga}|${
                info.gd
            }|${info.pts}|${lastFive}|`
        );
    });
}

function getStandings(groups, teamMap) {
    let lines = [];
    lines.push("## Standings");
    groups.forEach((group, groupIndex) => {
        appendStandingsHeader(
            lines,
            groups.length > 1
                ? `Group ${String.fromCharCode(65 + groupIndex)}`
                : null,
            teamMap
        );
        appendResults(lines, groupStandings(group), teamMap);
    });

    appendStandingsHeader(lines, "You vs. AI");
    appendResults(lines, yourStandings(groups));

    return utils.markdown2Html(lines.join("\n"));
}

utils.getTeamMap(argv.teamsfile).then(teamMap => {
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
          ${getStandings(groups, teamMap)}
        </div>
        <div class="column">
         <h2>Group Matches</h2>
            <div class="scrollable">
            ${getMatches(groups)}
          </div>
        </div>
      </div>
    </div>`;

        utils.writeHtml(
            bodyInnerHTML,
            utils.getFilePath(argv.key, "index.html")
        );
    });
});

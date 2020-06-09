const fs = require("fs");
const utils = require("./utils");

const argv = require("yargs")
    .alias("k", "key")
    .alias("c", "category")
    .demandOption("key").demandOption("category").argv;

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

function yourStandings(oms) {
    let you = new TeamInfo("You");
    let ai = new TeamInfo("AI");

    let index = 0;
    for (const match of oms.map(om => om.match).filter(
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
    return calcStandings([you, ai]);
}

function orderedMatches(groups) {
    const oms = [];
    //
    // If each group has more than one team AND the number of teams per group is an even number
    // then play all the games at each stage in each group together so its more exciting.
    //
    let groupSize = groups[0].teams.length;
    let index = 0;
    if (groups.length > 1 && groupSize % 2 == 0) {
        let stageSize = groupSize / 2;
        let numMatchesPer = groups[0].matches.length;
        while (index < numMatchesPer) {
            groups.forEach((group, groupIndex) => {
                let stageIndex = 0;
                while (stageIndex < stageSize) {
                    oms.push({ match: group.matches[index + stageIndex], groupIndex});
                    stageIndex++;
                }
            });
            index += stageSize;
        }
    } else {
        let maxMatches = 0;
        for (const group of groups) {
            if (group.matches.length > maxMatches) {
                maxMatches = group.matches.length;
            }
        }

        while (index < maxMatches) {
            groups.forEach((group, groupIndex) => {
                oms.push({ match: group.matches[index], groupIndex});
            });
            index++;
        }
    }
    return oms;
}

function getMatches(groups, oms) {
    let lines = [];
    lines.push(
        `${groups.length > 1 ? "|" : ""}| Home | Score | Away | Score | Note |`
    );
    lines.push(`${groups.length > 1 ? "|:---:" : ""}|---|---|---|---|---|`);

    for (let om of oms) {
        lines.push(
            `${
                groups.length > 1
                    ? `|${String.fromCharCode(65 + om.groupIndex)}`
                    : ""
            }|${displayTeam(om.match, 0)}|${displayTeam(om.match, 1)}|${om.match[0]
                .note || ""}|`
        );
    }

    return utils.markdown2Html(lines.join("\n"));
}

function appendStandingsHeader(lines, title, showRating) {
    if (title) {
        lines.push(`## ${title}`);
    }
    lines.push(
        `||${
            showRating ? " R |" : ""
        } Team | MP | W | D | L | GF | GA | GD | Pts | Last 5 |`
    );
    lines.push(
        `|:---:|${
            showRating ? ":---:|" : ""
        }---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|`
    );
}

function appendResults(lines, infos, teamMap, showRating) {
    infos.forEach((info, index) => {
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
            `${index + 1}|${
                showRating && teamMap ? teamMap.get(info.team).rating + "|" : ""
            }${info.team}|${info.mp}|${info.wins}|${info.draws}|${info.loses}|${
                info.gf
            }|${info.ga}|${info.gd}|${info.pts}|${lastFive}|`
        );
    });
}

function getStandings(groups, teamMap) {
    let lines = [];
    lines.push("## Standings");
    groups.forEach((group, groupIndex) => {
        let infos = groupStandings(group);
        let showRating = teamMap && teamMap.get(infos[0].team).rating;
        appendStandingsHeader(
            lines,
            groups.length > 1
                ? `Group ${String.fromCharCode(65 + groupIndex)}`
                : null,
            showRating
        );
        appendResults(lines, groupStandings(group), teamMap, showRating);
    });

    return utils.markdown2Html(lines.join("\n"));
}

function addYourStandings(oms) {
    let lines = [];
    appendStandingsHeader(lines, "You vs. AI");
    appendResults(lines, yourStandings(oms));
    return utils.markdown2Html(lines.join("\n"));
}

utils.getTeamMap(argv.category, argv.key).then(teamMap => {
    fs.readFile(utils.getMatchFile(argv.category, argv.key), "utf8", function(
        err,
        contents
    ) {
        const groups = JSON.parse(contents);
        let oms = orderedMatches(groups);

        const roman = argv.key.toUpperCase();
        const bodyInnerHTML = `<div style="border: 15px">
        ${groups.length > 1 ? '<a href="bracket.html">Bracket</a>' : ""}
      <h1 style="text-align: center">FIFA 20 ${roman}</h1>
      <div class="row">
        <div class="column" style="padding-right: 15px">
          ${getStandings(groups, teamMap)}
          ${addYourStandings(oms)}
        </div>
        <div class="column">
         <h2>Group Matches</h2>
            <div class="scrollable">
            ${getMatches(groups, oms)}
          </div>
        </div>
      </div>
    </div>`;

        utils.writeHtml(
            bodyInnerHTML,
            utils.getFilePath(argv.category, argv.key, "index.html")
        );
    });
});

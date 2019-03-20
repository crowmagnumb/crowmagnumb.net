const fs = require("fs");
const utils = require("./utils");

function getTeamInfo(infoMap, team) {
    let info = infoMap.get(team);
    if (!info) {
        info = {
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
    return info;
}

function buildInfoMap(matchesContents) {
    let infoMap = new Map();
    //
    // Ignore matches that haven't been recorded yet.
    //
    const matches = matchesContents
        .split("\n")
        .map(match => match.split(","))
        .filter(match => match[2] !== "");

    //
    // Fill info map
    //
    for (const match of matches) {
        let info1 = getTeamInfo(infoMap, match[0]);
        let info2 = getTeamInfo(infoMap, match[1]);
        let score1 = parseInt(match[2]);
        let score2 = parseInt(match[3]);
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

    return infoMap;
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

fs.readFile(utils.getFilePath("groups.json"), "utf8", function(
    err,
    groupsContents
) {
    fs.readFile(utils.getFilePath("group_matches.csv"), "utf8", function(
        err,
        matchesContents
    ) {
        const infoMap = buildInfoMap(matchesContents);

        let lines = [];
        lines.push("# World Cup Standings");
        const groups = JSON.parse(groupsContents);
        groups.forEach((group, groupIndex) => {
            lines.push(`## Group ${String.fromCharCode(65 + groupIndex)}`);
            lines.push("| Team | MP | W | D | L | GF | GA | GD | Pts |");
            lines.push("|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|");

            const infos = group.map(team => infoMap.get(team));

            infos.sort(groupSort);

            for (const info of infos) {
                lines.push(
                    `|${info.team}|${info.mp}|${info.wins}|${info.draws}|${
                        info.loses
                    }|${info.gf}|${info.ga}|${info.gd}|${info.pts}|`
                );
            }
        });
        utils.markdown2Html(
            lines.join("\n"),
            utils.getFilePath("group_standings.html")
        );
    });
});

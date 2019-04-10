const fs = require("fs");
const utils = require("./utils");

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

fs.readFile(utils.getFilePath("groups.json"), "utf8", function(err, contents) {
    const groups = JSON.parse(contents);

    let lines = [];
    lines.push("# World Cup Standings");
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
    utils.markdown2Html(
        lines.join("\n"),
        utils.getFilePath("group_standings.html")
    );
});

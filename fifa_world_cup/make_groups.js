const utils = require("./utils");

function sequence(N) {
    return Array.from(new Array(N), (val, index) => index);
}

fs.readFile("pots.json", "utf8", function(err, contents) {
    const pots = JSON.parse(contents);
    let groups = [];

    for (let groupIndex of sequence(pots[0].length)) {
        let group = [];
        groups.push(group);

        for (let potIndex of sequence(pots.length)) {
            let index = Math.floor(Math.random() * (8 - groupIndex));
            let team = pots[potIndex][index];
            pots[potIndex].splice(index, 1);
            group.push(team);
        }
    }

    fs.writeFile(
        utils.getFilePath("groups.json"),
        JSON.stringify(groups),
        err => {
            if (err) {
                throw err;
            }
        }
    );
});

const utils = require("./utils");

utils.getSortedTeams().then(teams => {
    //
    // UNCOMMENT to see the rankings before making the groups.
    //
    teams.forEach((team, index) => {
        console.log(index + 1, team.team, team.rating);
    });
});

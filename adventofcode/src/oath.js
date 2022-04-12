var defenseFaces = [
    {},
    {},
    { shields: 1 },
    { shields: 1 },
    { shields: 2 },
    { doubles: true },
];
var attackFaces = [
    { swords: 0.5 },
    { swords: 0.5 },
    { swords: 0.5 },
    { swords: 1 },
    { swords: 1 },
    { swords: 2, skulls: 1 },
];
function rollDefense(num) {
    var shields = 0;
    var doubles = 0;
    for (var ii = 0; ii < num; ii++) {
        var roll = defenseFaces[Math.floor(Math.random() * 6)];
        shields += roll.shields || 0;
        if (roll.doubles) {
            doubles++;
        }
    }
    return (shields *= Math.pow(2, doubles));
}
function rollAttack(num) {
    var swords = 0;
    var skulls = 0;
    for (var ii = 0; ii < num; ii++) {
        var roll = attackFaces[Math.floor(Math.random() * 6)];
        swords += roll.swords || 0;
        skulls += roll.skulls || 0;
    }
    return { swords: Math.floor(swords), skulls: skulls };
}
function score(attackWarbands, defenseDice, defenseWarbands, iters) {
    var p0 = 0; // Succeed without losing any warbands (including skulls).
    // let p1 = 0; // Succeed without losing any warbands (not including skulls).
    var p2 = 0; // Succeed but lose half your warbands rounded down.
    var p3 = 0; // Succeed but have no warbands left.
    for (var ii = 0; ii < iters; ii++) {
        var attack = rollAttack(attackWarbands);
        var defense = rollDefense(defenseDice) + defenseWarbands;
        var wb = attackWarbands - attack.skulls;
        var result = attack.swords - defense;
        if (result > 0) {
            if (attack.skulls === 0) {
                p0++;
            }
            // p1++;
        }
        if (result + Math.floor(wb / 2) > 0) {
            p2++;
        }
        if (result + wb > 0) {
            p3++;
        }
    }
    console.log(attackWarbands, defenseDice, defenseWarbands, (p0 / iters).toFixed(3), 
    // (p1 / iters).toFixed(3),
    (p2 / iters).toFixed(3), (p3 / iters).toFixed(3));
}
score(5, 2, 1, 1000000);
score(4, 2, 1, 1000000);
score(3, 2, 1, 1000000);
score(2, 2, 1, 1000000);
score(1, 2, 1, 1000000);
score(5, 3, 1, 1000000);
score(4, 3, 1, 1000000);
score(3, 3, 1, 1000000);
score(2, 3, 1, 1000000);
score(1, 3, 1, 1000000);
score(1, 1, 1, 1000000);
score(2, 1, 1, 1000000);
score(3, 1, 1, 1000000);
score(4, 1, 1, 1000000);

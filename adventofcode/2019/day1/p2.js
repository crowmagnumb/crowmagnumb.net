const utils = require("../../src/utils");

let total = 0;

const calcFuel = (mass) => {
    return Math.floor(mass / 3) - 2;
};

const fn = (line) => {
    let value = calcFuel(parseInt(line));
    while (value > 0) {
        total += value;
        value = calcFuel(value);
    }
};

utils.actOnLines("2019/day1/input.txt", fn).then(() => {
    console.log(total);
});

const utils = require("../../utils");

let total = 0;
const fn = line => {
  total += Math.floor(parseInt(line) / 3) - 2;
};

utils.actOnLines("2019/day1/input.txt", fn).then(() => {
  console.log(total);
});

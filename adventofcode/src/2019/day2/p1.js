const utils = require("../../utils");
const computer = require("./computer");

utils.readFileToLines("2019/day2/input.txt").then(lines => {
  let code = lines[0].split(",").map(value => parseInt(value));
  console.log(computer.compute(code, 12, 2));
});

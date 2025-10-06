const utils = require("../../utils");
const path = require("path");
const computer = require("./computer");

utils.readFileToLines(path.join(__dirname, "input.txt")).then(lines => {
  let code = lines[0].split(",").map(val => parseInt(val));
  computer.compute(code, 1);
});

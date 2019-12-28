const utils = require("../../utils");
const computer = require("./computer");

utils.readFileToLines("2019/day2/input.txt").then(lines => {
  let code = lines[0].split(",").map(value => parseInt(value));

  let done = false;
  for (let noun = 0; noun <= 99; noun++) {
    for (let verb = 0; verb <= 99; verb++) {
      if (computer.compute([...code], noun, verb) === 19690720) {
        console.log(100 * noun + verb);
      }
    }
    if (done) {
      break;
    }
  }
});

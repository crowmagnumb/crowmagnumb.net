const computer = require("./computer");

let code = "3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99"
  .split(",")
  .map(val => parseInt(val));
computer.compute(code, 7);
computer.compute(code, 8);
computer.compute(code, 12);

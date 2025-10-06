const { getData, dirEnum, intersections, makeWireInst } = require("./day3");

const args = process.argv.slice(2);

function countSteps(intersection, instructions) {
  let steps = 0;
  let xpos = 0;
  let ypos = 0;
  for (let inst of instructions) {
    for (let ii = 0; ii < inst.num; ii++) {
      steps++;
      switch (inst.dir) {
        case dirEnum.RIGHT:
          xpos++;
          break;
        case dirEnum.LEFT:
          xpos--;
          break;
        case dirEnum.UP:
          ypos++;
          break;
        case dirEnum.DOWN:
          ypos--;
          break;
      }
      if (intersection.x === xpos && intersection.y === ypos) {
        return steps;
      }
    }
  }
}

function runit(wire1Str, wire2Str) {
  const inst1 = makeWireInst(wire1Str);
  const inst2 = makeWireInst(wire2Str);
  let ans = Infinity;
  for (const intersection of intersections(wire1Str, wire2Str)) {
    let steps1 = countSteps(intersection, inst1);
    let steps2 = countSteps(intersection, inst2);
    let tmp = steps1 + steps2;
    // console.log(intersection, steps1, steps2, tmp);
    if (tmp < ans) {
      ans = tmp;
    }
  }
  console.log(`Answer: ${ans}`);
}

getData(args.length ? args[0] : null).then(data => {
  runit(data.wire1, data.wire2);
});

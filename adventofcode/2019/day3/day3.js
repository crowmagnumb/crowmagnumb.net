const path = require("path");
const BitArray = require("bit-array");
const utils = require("../../utils");

let dirEnum = {
  DOWN: 0,
  RIGHT: 1,
  LEFT: 2,
  UP: 3
};

const makeWireInst = wireStr => {
  return wireStr.split(",").map(bit => {
    let dir;
    switch (bit.substring(0, 1)) {
      case "R":
        dir = dirEnum.RIGHT;
        break;
      case "D":
        dir = dirEnum.DOWN;
        break;
      case "U":
        dir = dirEnum.UP;
        break;
      case "L":
        dir = dirEnum.LEFT;
        break;
    }
    return {
      dir,
      num: parseInt(bit.substring(1))
    };
  });
};

exports.data = async function(type) {
  switch (type) {
    case "test1":
      return {
        wire1: "R75,D30,R83,U83,L12,D49,R71,U7,L72",
        wire2: "U62,R66,U55,R34,D71,R55,D58,R83"
      };
    case "test2":
      return {
        wire1: "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51",
        wire2: "U98,R91,D20,R16,D67,R40,U7,R15,U6,R7"
      };
    default:
      return utils
        .readFileToLines(path.join(__dirname, "input.txt"))
        .then(lines => {
          return { wire1: lines[0], wire2: lines[1] };
        });
  }
};

exports.intersections = function(wire1Str, wire2Str, visualize = false) {
  let wire1 = makeWireInst(wire1Str);
  let wire2 = makeWireInst(wire2Str);

  let xmax = -Infinity;
  let ymax = -Infinity;
  let xmin = Infinity;
  let ymin = Infinity;

  let gaugeWire = wire => {
    let x = 0;
    let y = 0;
    for (let inst of wire) {
      switch (inst.dir) {
        case dirEnum.RIGHT:
          x += inst.num;
          if (x > xmax) {
            xmax = x;
          }
          break;
        case dirEnum.LEFT:
          x -= inst.num;
          if (x < xmin) {
            xmin = x;
          }
          break;
        case dirEnum.UP:
          y += inst.num;
          if (y > ymax) {
            ymax = y;
          }
          break;
        case dirEnum.DOWN:
          y -= inst.num;
          if (y < ymin) {
            ymin = y;
          }
          break;
      }
    }
  };

  gaugeWire(wire1);
  gaugeWire(wire2);

  let xoffset = xmin < 0 ? -xmin : 0;
  let yoffset = ymin < 0 ? -ymin : 0;

  console.log(xmin, xmax, ymin, ymax, xoffset, yoffset);

  function fillGrid(grid, wire) {
    let x = xoffset;
    let y = yoffset;
    for (let inst of wire) {
      switch (inst.dir) {
        case dirEnum.RIGHT:
          for (let xpos = x; xpos <= x + inst.num; xpos++) {
            grid[y].set(xpos, true);
          }
          x += inst.num;
          break;
        case dirEnum.LEFT:
          for (let xpos = x; xpos >= x - inst.num; xpos--) {
            grid[y].set(xpos, true);
          }
          x -= inst.num;
          break;
        case dirEnum.UP:
          for (let ypos = y; ypos <= y + inst.num; ypos++) {
            grid[ypos].set(x, true);
          }
          y += inst.num;
          break;
        case dirEnum.DOWN:
          for (let ypos = y; ypos >= y - inst.num; ypos--) {
            grid[ypos].set(x, true);
          }
          y -= inst.num;
          break;
      }
    }
  }

  function makeArray(width, height, wire) {
    let arr = [];
    for (let y = 0; y < height; y++) {
      arr.push(new BitArray(width));
    }
    fillGrid(arr, wire);
    return arr;
  }

  let width = xmax + xoffset + 1;
  let height = ymax + yoffset + 1;

  let grid1 = makeArray(width, height, wire1);
  let grid2 = makeArray(width, height, wire2);

  if (visualize) {
    let toColor = (x, y) => {
      let r = 0;
      let g = 0;
      let b = 0;
      if (grid1[y].get(x)) {
        if (grid2[y].get(x)) {
          r = 255;
        } else {
          b = 255;
        }
      } else if (grid2[y].get(x)) {
        g = 255;
      }
      return {
        r,
        g,
        b,
        a: 255
      };
    };

    utils.arrayToPng(path.join(__dirname, "wires.png"), width, height, toColor);
  }

  let intersections = [];
  for (let x = 0; x < xmax + xoffset; x++) {
    for (let y = 0; y < ymax + yoffset; y++) {
      if (grid1[y].get(x) && grid2[y].get(x)) {
        let xans = x - xoffset;
        let yans = y - yoffset;
        if (xans !== 0 || yans !== 0) {
          intersections.push({ x: xans, y: yans });
        }
      }
    }
  }

  return intersections;
};

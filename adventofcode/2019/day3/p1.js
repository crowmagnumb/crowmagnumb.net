const fs = require("fs");
const path = require("path");
const BitArray = require("bit-array");
const { createCanvas } = require("canvas");
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

function runit(wire1Str, wire2Str, visualize = false) {
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

  // function makeArray(arg, def = 0) {
  //   if (arg.length > 2) {
  //     return Array(arg[0])
  //       .fill()
  //       .map(() => arr(arg.slice(1)));
  //   } else {
  //     return Array(arg[0])
  //       .fill()
  //       .map(() => Array(arg[1]).fill(def));
  //   }
  // }
  function makeArray(xsize, ysize) {
    let arr = [];
    for (y = 0; y < ysize; y++) {
      arr.push(new BitArray(xsize));
    }
    return arr;
  }

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

  let xsize = xmax + xoffset + 1;
  let ysize = ymax + yoffset + 1;
  let grid1 = makeArray(xsize, ysize);
  let grid2 = makeArray(xsize, ysize);

  fillGrid(grid1, wire1);
  fillGrid(grid2, wire2);

  if (visualize) {
    let buffer = new Uint8ClampedArray(xsize * ysize * 4); // have enough bytes
    for (var y = 0; y < ysize; y++) {
      for (var x = 0; x < xsize; x++) {
        var pos = (y * xsize + x) * 4; // position in buffer based on x and y
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
        buffer[pos] = r;
        buffer[pos + 1] = g;
        buffer[pos + 2] = b;
        buffer[pos + 3] = 255; // set alpha channel
      }
    }

    const canvas = createCanvas(xsize, ysize);
    const ctx = canvas.getContext("2d");

    let idata = ctx.createImageData(xsize, ysize);
    idata.data.set(buffer);

    ctx.putImageData(idata, 0, 0);

    const filename = path.join(__dirname, "wires.png");
    const out = fs.createWriteStream(filename);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on("finish", () => console.log(`${filename} created.`));
  }

  let ans = Infinity;
  for (let x = 0; x < xmax + xoffset; x++) {
    for (let y = 0; y < ymax + yoffset; y++) {
      if (grid1[y].get(x) && grid2[y].get(x)) {
        let xans = x - xoffset;
        let yans = y - yoffset;
        let anstest = Math.abs(xans) + Math.abs(yans);
        if (anstest > 0) {
          console.log(xans, yans);
          if (anstest < ans) {
            ans = anstest;
          }
        }
      }
    }
  }

  console.log("\n");
  console.log(`Answer: ${ans}`);
}

// let wire1Str;
// let wire2Str;
//
// wire1Str = "R75,D30,R83,U83,L12,D49,R71,U7,L72";
// wire2Str = "U62,R66,U55,R34,D71,R55,D58,R83";
//
// wire1Str = "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51";
// wire2Str = "U98,R91,D20,R16,D67,R40,U7,R15,U6,R7";
//
// runit(wire1Str, wire2Str, true);

utils.readFileToLines(path.join(__dirname, "input.txt")).then(lines => {
  runit(lines[0], lines[1]);
});

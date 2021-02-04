let fs = require("fs");
const blessed = require("blessed");
const { createCanvas } = require("canvas");

const readFile = filename => {
  return new Promise(function(resolve, reject) {
    fs.readFile(filename, "utf8", function(err, data) {
      if (err) {
        reject(err);
      }

      resolve(data);
    });
  });
};

const readFileToLines = filename => {
  return readFile(filename).then(data => {
    return data.split("\n").filter(line => {
      return line !== "";
    });
  });
};

module.exports = {
  readFile,
  readFileToLines,
  actOnLines: (filename, fn) => {
    return readFileToLines(filename).then(lines => {
      for (const line of lines) {
        fn(line);
      }
    });
  },
  buildBlessed: function() {
    let screen = blessed.screen({
      smartCSR: true
    });

    let box = blessed.box({
      top: "center",
      left: "center",
      width: "shrink",
      height: "shrink",
      tags: true,
      border: {
        type: "line"
      },
      style: {
        fg: "yellow",
        bg: "black",
        border: {
          fg: "#f0f0f0"
        }
        // hover: {
        //   bg: 'green'
        // }
      }
    });
    screen.append(box);

    // Quit on Escape, q, or Control-C.
    screen.key(["escape", "q", "C-c"], function(ch, key) {
      return process.exit(0);
    });

    // Focus our element.
    box.focus();

    return {
      screen,
      box,
      render: function(result) {
        box.setContent(result);
        screen.render();
      }
    };
  },
  arrayToPng: function(filename, width, height, toColorFn) {
    let buffer = new Uint8ClampedArray(width * height * 4);
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var pos = (y * width + x) * 4;
        const color = toColorFn(x, y);
        buffer[pos] = color.r;
        buffer[pos + 1] = color.g;
        buffer[pos + 2] = color.b;
        buffer[pos + 3] = color.a;
      }
    }

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    let idata = ctx.createImageData(width, height);
    idata.data.set(buffer);

    ctx.putImageData(idata, 0, 0);

    const out = fs.createWriteStream(filename);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on("finish", () => console.log(`${filename} created.`));
  }
};

let fs = require("fs");
const blessed = require("blessed");

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
  }
};

const utils = require("../../utils");
const path = require("path");
const { buildMap } = require("./day6.js");

utils.readFileToLines(path.join(__dirname, "input.txt")).then(lines => {
  console.log(
    buildMap(lines)
      .get("COM")
      .totalOrbitCount()
  );
});

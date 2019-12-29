const utils = require("../../utils");
const path = require("path");
const { buildMap } = require("./day6.js");

utils.readFileToLines(path.join(__dirname, "input.txt")).then(lines => {
  let orbmap = buildMap(lines);

  let com = orbmap.get("COM");
  let you = orbmap.get("YOU");
  let santa = orbmap.get("SAN");

  // console.log(com.depthOfChild(you));
  // console.log(com.depthOfChild(santa));
  // console.log(com.depthOfChild(com));

  let lineageYou = com.lineage(you);
  let lineageSanta = com.lineage(santa);
  // console.log(lineageYou.map(node => node.obj));
  let parent = null;
  for (let node of lineageYou) {
    let n2 = lineageSanta.find(n => n.obj === node.obj);
    if (n2) {
      parent = node;
    } else {
      break;
    }
  }
  console.log(
    `Answer: ${parent.depthOfChild(you) + parent.depthOfChild(santa) - 2}`
  );
});

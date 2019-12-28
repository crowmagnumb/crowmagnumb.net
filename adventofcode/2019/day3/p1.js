const day3 = require("./day3");

const args = process.argv.slice(2);

function runit(wire1Str, wire2Str, visualize = false) {
  let ans = Infinity;
  for (const intersection of day3.intersections(
    wire1Str,
    wire2Str,
    visualize
  )) {
    let anstest = Math.abs(intersection.x) + Math.abs(intersection.y);
    if (anstest > 0) {
      console.log(intersection.x, intersection.y);
      if (anstest < ans) {
        ans = anstest;
      }
    }
  }

  console.log("\n");
  console.log(`Answer: ${ans}`);
}

day3.getData(args.length ? args[0] : null).then(data => {
  runit(data.wire1, data.wire2, args.length);
});

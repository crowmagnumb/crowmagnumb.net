const { compute } = require("./computer");
const { getData } = require("./day7");
const args = process.argv.slice(2);

getData(args.length ? args[0] : null).then(data => {
  let code = data.split(",").map(val => parseInt(val));
  let ans = 0;
  // console.log(compute([...code], [3, 2], true));
  // process.exit();
  for (let a = 0; a < 5; a++) {
    let ca = compute([...code], [a, 0]).pop();
    for (let b = 0; b < 5; b++) {
      if (b === a) {
        continue;
      }
      let cb = compute([...code], [b, ca]).pop();
      for (let c = 0; c < 5; c++) {
        if (c === a || c === b) {
          continue;
        }
        let cc = compute([...code], [c, cb]).pop();
        for (let d = 0; d < 5; d++) {
          if (d === a || d === b || d === c) {
            continue;
          }
          let cd = compute([...code], [d, cc]).pop();
          for (let e = 0; e < 5; e++) {
            if (e === a || e === b || e === c || e === d) {
              continue;
            }
            let ce = compute([...code], [e, cd]).pop();
            // console.log(a, b, c, d, e, ca, cb, cc, cd, ce);
            if (ce > ans) {
              ans = ce;
            }
          }
        }
      }
    }
  }
  console.log(`Answer: ${ans}`);
});

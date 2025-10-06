const { compute } = require("./computer");
const { getData2 } = require("./day7");
const args = process.argv.slice(2);

function runIt(code, a, b, c, d, e) {
  let ans = 0;
  while (ans === 0) {
    let ca = compute([...code], [a, ans]).pop();
    let cb = compute([...code], [b, ca]).pop();
    let cc = compute([...code], [c, cb]).pop();
    let cd = compute([...code], [d, cc]).pop();
    ans = compute([...code], [e, cd]).pop();
    console.log(ans);
  }
  return ans;
}

getData2(args.length ? args[0] : null).then(data => {
  let code = data.split(",").map(val => parseInt(val));
  let ans = { value: 0 };
  console.log(compute([...code], [0, 1], true));
  process.exit();
  let minval = 5;
  let maxval = 9;
  for (let a = minval; a <= maxval; a++) {
    for (let b = minval; b <= maxval; b++) {
      for (let c = minval; c <= maxval; c++) {
        for (let d = minval; d <= maxval; d++) {
          for (let e = minval; e <= maxval; e++) {
            let set = new Set();
            set.add(a);
            set.add(b);
            set.add(c);
            set.add(d);
            set.add(e);
            if (set.size === 5) {
              let ce = runIt(code, a, b, c, d, e);
              if (ce > ans.value) {
                ans.value = ce;
                ans.a = a;
                ans.b = b;
                ans.c = c;
                ans.d = d;
                ans.e = e;
              }
            }
          }
        }
      }
    }
  }
  console.log(ans);
});

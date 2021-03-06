let pmin = 109165;
let pmax = 576723;

function checkPass(pass) {
  const pstr = String(pass);
  let last = pstr[0];
  let hasDouble = false;
  for (let ii = 1; ii <= pstr.length; ii++) {
    if (pstr[ii] < last) {
      return false;
    }
    if (pstr[ii] === last) {
      hasDouble = true;
    }
    last = pstr[ii];
  }
  return hasDouble;
}

let count = 0;
for (let pass = pmin; pass <= pmax; pass++) {
  if (checkPass(pass)) {
    count++;
  }
}

console.log(count);

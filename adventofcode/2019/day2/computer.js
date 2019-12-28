exports.compute = (code, noun, verb) => {
  code[1] = noun;
  code[2] = verb;

  let done = false;
  let index = 0;
  while (!done) {
    let op = code[index];
    switch (op) {
      case 1:
        code[code[index + 3]] = code[code[index + 1]] + code[code[index + 2]];
        break;
      case 2:
        code[code[index + 3]] = code[code[index + 1]] * code[code[index + 2]];
        break;
      case 99:
        done = true;
        break;
      default:
        throw Error(`Bad opcode [${op}]`);
    }
    index += 4;
  }

  return code[0];
};

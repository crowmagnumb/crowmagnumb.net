class InputSequence {
  constructor(inputs) {
    this.inputs = inputs;
    this.inputIndex = 0;
  }

  next() {
    let input = this.inputs[this.inputIndex];
    this.inputIndex++;
    return input;
  }
}

class Instruction {
  constructor(codeVal) {
    this.op = String(codeVal);
    this.mode = [0, 0, 0];

    if (this.op.length === 1) {
      this.opcode = "0" + this.op;
    } else if (this.op.length === 2) {
      this.opcode = this.op;
    } else if (this.op.length === 3) {
      this.mode[0] = parseInt(this.op.substring(0, 1));
      this.opcode = this.op.substring(1);
    } else if (this.op.length === 4) {
      this.mode[1] = parseInt(this.op.substring(0, 1));
      this.mode[0] = parseInt(this.op.substring(1, 2));
      this.opcode = this.op.substring(2);
    } else if (this.op.length === 5) {
      this.mode[2] = parseInt(this.op.substring(0, 1));
      this.mode[1] = parseInt(this.op.substring(1, 2));
      this.mode[0] = parseInt(this.op.substring(2, 3));
      this.opcode = this.op.substring(3);
    }
  }

  _readValue(code, index, param) {
    let regValue = code[index + param];
    if (this.mode[param - 1] === 0) {
      return code[regValue];
    }
    return regValue;
  }

  _setValue(code, index, param, value) {
    if (this.mode[param - 1] === 0) {
      code[code[index + param]] = value;
    } else {
      code[index + param] = value;
    }
  }

  _parseFourStep(code, index) {
    return {
      regVals: [code[index + 1], code[index + 2], code[index + 3]],
      value1: this._readValue(code, index, 1),
      value2: this._readValue(code, index, 2),
      step: 4
    };
  }

  operate(code, index, inputSequence) {
    switch (this.opcode) {
      case "01": {
        let result = this._parseFourStep(code, index);
        this._setValue(code, index, 3, result.value1 + result.value2);
        return result;
      }
      case "02": {
        let result = this._parseFourStep(code, index);
        this._setValue(code, index, 3, result.value1 * result.value2);
        return result;
      }
      case "03":
        // console.log("Providing input...");
        let input = inputSequence.next();
        code[code[index + 1]] = input;
        return {
          regVals: [code[index + 1]],
          input,
          step: 2
        };
      case "04":
        return { output: this._readValue(code, index, 1), step: 2 };
      case "05":
        if (this._readValue(code, index, 1) !== 0) {
          return { jump: this._readValue(code, index, 2) };
        }
        return { step: 3 };
      case "06":
        if (this._readValue(code, index, 1) === 0) {
          return { jump: this._readValue(code, index, 2) };
        }
        return { step: 3 };
      case "07":
        this._setValue(
          code,
          index,
          3,
          this._readValue(code, index, 1) < this._readValue(code, index, 2)
            ? 1
            : 0
        );
        return { step: 4 };
      case "08":
        this._setValue(
          code,
          index,
          3,
          this._readValue(code, index, 1) === this._readValue(code, index, 2)
            ? 1
            : 0
        );
        return { step: 4 };
      case "99":
        return { step: 1 };
      default:
        throw Error(`Bad opcode [${this.opcode}]`);
    }
  }
}

exports.compute = (code, inputs, debug = false) => {
  let done = false;
  let index = 0;
  let insts = [];
  let outputs = [];
  let inputSequence = new InputSequence(inputs);

  while (!done) {
    if (debug) {
      console.log(code[index]);
    }
    let inst = new Instruction(code[index]);
    if (debug) {
      console.log(inst);
    }
    let result = inst.operate(code, index, inputSequence);
    if (debug) {
      console.log(result);
    }
    switch (inst.opcode) {
      case "04":
        outputs.push({ value: result.output, insts });
        insts = [];
        break;
      case "99":
        done = true;
        break;
      default:
        insts.push({ inst, result });
    }
    if (result.jump) {
      index = result.jump;
    } else {
      index += result.step;
    }
  }

  return outputs.map(output => output.value);
};

const INPUT_VALUE = 1;

class Instruction {
  constructor(codeVal) {
    this.op = String(codeVal);
    this.mode1 = 0;
    this.mode2 = 0;
    this.mode3 = 0;

    if (this.op.length === 1) {
      this.opcode = "0" + this.op;
    } else if (this.op.length === 2) {
      this.opcode = this.op;
    } else if (this.op.length === 3) {
      this.mode1 = parseInt(this.op.substring(0, 1));
      this.opcode = this.op.substring(1);
    } else if (this.op.length === 4) {
      this.mode2 = parseInt(this.op.substring(0, 1));
      this.mode1 = parseInt(this.op.substring(1, 2));
      this.opcode = this.op.substring(2);
    } else if (this.op.length === 5) {
      this.mode3 = parseInt(this.op.substring(0, 1));
      this.mode2 = parseInt(this.op.substring(1, 2));
      this.mode1 = parseInt(this.op.substring(2, 3));
      this.opcode = this.op.substring(3);
    }
  }

  readValue(code, regValue, mode) {
    if (mode === 0) {
      return code[regValue];
    }
    return regValue;
  }

  setValue(code, index, mode, value) {
    if (mode === 0) {
      code[code[index + 3]] = value;
    } else {
      code[index + 3] = value;
    }
  }

  _parseFourStep(code, index) {
    let regVal1 = code[index + 1];
    let regVal2 = code[index + 2];
    return {
      regVal1,
      regVal2,
      regVal3: code[index + 3],
      value1: this.readValue(code, regVal1, this.mode1),
      value2: this.readValue(code, regVal2, this.mode2),
      step: 4
    };
  }

  operate(code, index) {
    switch (this.opcode) {
      case "01": {
        let result = this._parseFourStep(code, index);
        this.setValue(code, index, this.mode3, result.value1 + result.value2);
        return result;
      }
      case "02": {
        let result = this._parseFourStep(code, index);
        this.setValue(code, index, this.mode3, result.value1 * result.value2);
        return result;
      }
      case "03":
        // console.log("Providing input...");
        code[code[index + 1]] = INPUT_VALUE;
        return {
          step: 2
        };
      case "04":
        return { diagcode: code[code[index + 1]], step: 2 };
      case "99":
        return { step: 1 };
      default:
        throw Error(`Bad opcode [${this.opcode}]`);
    }
  }
}

exports.compute = code => {
  let done = false;
  let index = 0;
  let insts = [];
  let diagcode = null;
  while (!done) {
    let inst = new Instruction(code[index]);
    let result = inst.operate(code, index);
    switch (inst.opcode) {
      case "04":
        diagcode = result.diagcode;
        break;
      case "99":
        console.log(`Diagnostic Result: ${diagcode}`);
        done = true;
        break;
      default:
        if (diagcode) {
          console.log(
            `========== Failed Diagnostic: ${diagcode} ===========================`
          );
          console.log("Instructions:");
          for (const inst of insts) {
            console.log(inst);
          }
          console.log(
            "=========================================================================="
          );
          insts = [];
          diagcode = null;
        }
        insts.push({ inst, result });
    }
    index += result.step;
  }
};

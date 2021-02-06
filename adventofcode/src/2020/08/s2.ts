import { FileUtils, Utils } from "../../utils/index";

type Instruction = {
    operation: string;
    argument: number;
};

type Result = {
    value: number;
    fail: boolean;
};

function evaluate(insts: Instruction[]) {
    let ran = new Set<number>();
    let result = { value: 0, fail: false } as Result;

    let index = 0;
    let done = false;
    while (!done) {
        if (ran.has(index)) {
            result.fail = true;
            done = true;
        } else {
            ran.add(index);
            let instruction = insts[index];
            switch (instruction.operation) {
                case "acc":
                    result.value += instruction.argument;
                    index++;
                    break;
                case "jmp":
                    index += instruction.argument;
                    break;
                case "nop":
                    index++;
                    break;
            }
        }
        if (index >= insts.length) {
            done = true;
        }
    }

    return result;
}

FileUtils.readFileToLines("data/2020/08/input").then((data) => {
    const insts = data.map((item) => {
        const parts = item.split(" ");
        return {
            operation: parts[0],
            argument: parseInt(parts[1]),
        } as Instruction;
    });

    let result: Result;
    for (let ii = 0; ii < insts.length; ii++) {
        let inst = insts[ii];
        if (inst.operation === "jmp") {
            const newInsts = [...insts];
            newInsts[ii] = { operation: "nop", argument: inst.argument };
            result = evaluate(newInsts);
        } else if (inst.operation === "nop") {
            const newInsts = [...insts];
            newInsts[ii] = { operation: "jmp", argument: inst.argument };
            result = evaluate(newInsts);
        } else {
            continue;
        }
        if (!result.fail) {
            break;
        }
    }
    console.log(result!.value);
});

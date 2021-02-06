import { FileUtils } from "../../utils/index";

type Instruction = {
    operation: string;
    argument: number;
};
FileUtils.readFileToLines("data/2020/08/input").then((data) => {
    const insts = data.map((item) => {
        const parts = item.split(" ");
        return {
            operation: parts[0],
            argument: parseInt(parts[1]),
        } as Instruction;
    });

    let ran = new Set<number>();
    let accumulator = 0;
    let index = 0;
    let done = false;
    while (!done) {
        if (ran.has(index)) {
            done = true;
        } else {
            ran.add(index);
            let instruction = insts[index];
            switch (instruction.operation) {
                case "acc":
                    accumulator += instruction.argument;
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
    }

    console.log(accumulator);
});

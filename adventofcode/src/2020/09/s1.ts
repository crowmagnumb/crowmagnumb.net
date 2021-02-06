import { FileUtils } from "../../utils/index";

// const INPUT = "data/2020/09/input_example";
// const PREAMBLE = 5;
const INPUT = "data/2020/09/input";
const PREAMBLE = 25;

function ok(numbers: number[], index: number) {
    let ok = false;
    for (let ii = index - PREAMBLE; ii < index; ii++) {
        for (let jj = index - PREAMBLE; jj < index; jj++) {
            if (numbers[ii] + numbers[jj] === numbers[index]) {
                ok = true;
                break;
            }
        }
        if (ok) {
            break;
        }
    }
    return ok;
}

FileUtils.readFileToLines(INPUT).then((data) => {
    const numbers = data.map((item) => parseInt(item));
    for (let ii = PREAMBLE; ii < numbers.length; ii++) {
        if (!ok(numbers, ii)) {
            console.log(numbers[ii]);
            break;
        }
    }
});

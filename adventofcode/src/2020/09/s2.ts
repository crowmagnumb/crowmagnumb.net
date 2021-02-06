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
    let invalidNumber: number;
    for (let ii = PREAMBLE; ii < numbers.length; ii++) {
        if (!ok(numbers, ii)) {
            invalidNumber = numbers[ii];
            break;
        }
    }

    let startIndex: number;
    let endIndex: number;
    if (invalidNumber!) {
        for (let ii = 0; ii < numbers.length; ii++) {
            let done: boolean = false;
            let success: boolean = false;
            let index = ii;
            let sum = numbers[ii];
            while (!done) {
                index++;
                sum += numbers[index];
                if (sum === invalidNumber) {
                    success = true;
                    done = true;
                } else if (sum > invalidNumber) {
                    done = true;
                }
            }
            if (success) {
                startIndex = ii;
                endIndex = index;
                break;
            }
        }

        let min = Number.MAX_SAFE_INTEGER;
        let max = 0;
        for (let ii = startIndex!; ii <= endIndex!; ii++) {
            if (numbers[ii] < min) {
                min = numbers[ii];
            }
            if (numbers[ii] > max) {
                max = numbers[ii];
            }
        }
        console.log(min + max);
    } else {
        console.log("No weakness found.");
    }
});

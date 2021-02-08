import { FileUtils } from "../../utils/index";

// const INPUT = "data/2020/10/input_example";
// const INPUT = "data/2020/10/input_example2";
const INPUT = "data/2020/10/input";

//
// Manually calculated up to 6, maybe we won't need more. Unlikely.
// UPDATE: That's all we needed! No need to write a routine to calculate.
//
const onesComboMap = new Map<number, number>();
onesComboMap.set(0, 1);
onesComboMap.set(1, 1);
onesComboMap.set(2, 1);
onesComboMap.set(3, 2);
onesComboMap.set(4, 4);
onesComboMap.set(5, 7);
onesComboMap.set(6, 14);

function getCombos(ones: number) {
    const value = onesComboMap.get(ones);
    if (value) {
        return value;
    } else {
        console.log(`Failed to find value for [${ones}].`);
        return 1;
    }
}

FileUtils.readFileToLines(INPUT).then((data) => {
    const numbers = [0, ...data.map((item) => parseInt(item))].sort(
        (a, b) => a - b
    );
    // console.log(numbers);

    // let ones = [];
    let currentOnes = 1;
    let product = 1;
    for (let ii = 1; ii < numbers.length; ii++) {
        if (numbers[ii] - numbers[ii - 1] === 1) {
            currentOnes++;
        } else {
            // ones.push(currentOnes);
            product *= getCombos(currentOnes);
            currentOnes = 1;
        }
    }
    if (currentOnes > 2) {
        // ones.push(currentOnes);
        product *= getCombos(currentOnes);
    }
    console.log(product);
});

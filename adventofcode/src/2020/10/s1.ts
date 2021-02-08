import { FileUtils } from "../../utils/index";

const INPUT = "data/2020/10/input_example";
// const INPUT = "data/2020/10/input";

FileUtils.readFileToLines(INPUT).then((data) => {
    const numbers = data.map((item) => parseInt(item)).sort((a, b) => a - b);
    let jolt1 = numbers[0] === 1 ? 1 : 0;
    let jolt3 = numbers[0] === 1 ? 0 : 1;
    for (let ii = 1; ii < numbers.length; ii++) {
        if (numbers[ii] - numbers[ii - 1] === 1) {
            jolt1++;
        } else {
            jolt3++;
        }
    }
    jolt3++;
    console.log(jolt1, jolt3, jolt1 * jolt3);
});

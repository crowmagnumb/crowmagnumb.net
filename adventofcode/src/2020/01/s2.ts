import { FileUtils } from "../../utils/index";

FileUtils.readFileToLines("data/2020/01/input.txt").then((data) => {
    const expenses = data.map((item) => parseInt(item));
    expenses.forEach((item, ii) => {
        for (let jj = ii + 1; jj < data.length; jj++) {
            for (let kk = ii + jj + 1; kk < data.length; kk++) {
                if (item + expenses[jj] + expenses[kk] === 2020) {
                    console.log(item * expenses[jj] * expenses[kk]);
                    break;
                }
            }
        }
    });
});

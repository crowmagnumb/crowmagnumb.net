import { FileUtils } from "../../utils/index";

FileUtils.readFileToLines("./input.txt").then((data) => {
    const expenses = data.map((item) => parseInt(item));
    expenses.forEach((item, ii) => {
        for (let jj = ii + 1; jj < data.length; jj++) {
            if (item + expenses[jj] === 2020) {
                console.log(item * expenses[jj]);
                break;
            }
        }
    });
});

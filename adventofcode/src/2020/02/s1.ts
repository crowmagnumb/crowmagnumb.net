import { FileUtils } from "../../utils/index";

FileUtils.readFileToLines("data/2020/02/input.txt").then((data) => {
    let correct = 0;
    console.log(data.length);
    for (const item of data) {
        const parts = item.split(": ");
        const rules = parts[0].split(" ");
        const counts = rules[0].split("-").map((rule) => parseInt(rule));
        const letter = rules[1];
        const pwd = parts[1].split("");

        const count = pwd.filter((char) => char === letter).length;
        if (count >= counts[0] && count <= counts[1]) {
            correct++;
        }
    }
    console.log(correct);
});

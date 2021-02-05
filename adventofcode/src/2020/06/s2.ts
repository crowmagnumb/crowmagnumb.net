import { FileUtils } from "../../utils/index";

FileUtils.readFileToLines("data/2020/06/input.txt").then((data) => {
    let anses: Set<string> = new Set<string>();
    let count = 0;
    let firstSet = true;
    for (const item of data) {
        if (item === "") {
            if (anses && anses.size) {
                count += anses.size;
            }
            firstSet = true;
            anses = new Set<string>();
        } else {
            if (firstSet) {
                for (const question of item.split("")) {
                    anses.add(question);
                    firstSet = false;
                }
            } else {
                let tmp = new Set<string>();
                for (const question of item.split("")) {
                    if (anses.has(question)) {
                        tmp.add(question);
                    }
                }
                anses = tmp;
            }
        }
    }
    //
    // Add last set.
    //
    count += anses.size;

    console.log(count);
});

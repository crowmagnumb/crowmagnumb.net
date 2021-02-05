import { FileUtils } from "../../utils/index";

FileUtils.readFileToLines("data/2020/06/input.txt").then((data) => {
    let anses = new Set<string>();
    let count = 0;
    for (const item of data) {
        if (item === "") {
            count += anses.size;
            anses = new Set<string>();
        } else {
            for (const question of item.split("")) {
                anses.add(question);
            }
        }
    }
    //
    // Add last set.
    //
    count += anses.size;

    console.log(count);
});

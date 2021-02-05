import { FileUtils } from "../../utils/index";

FileUtils.readFileToLines("data/2020/03/input.txt").then((data) => {
    const map = data.map((item) => item.split(""));

    const worldWidth = data[0].length;
    const XSLOPE = 3;
    let x = 0;
    let y = 0;
    let trees = 0;
    while (y < map.length) {
        if (map[y][x] === "#") {
            trees++;
        }
        x += XSLOPE;
        if (x > worldWidth - 1) {
            x -= worldWidth;
        }
        y++;
    }
    console.log(trees);
});

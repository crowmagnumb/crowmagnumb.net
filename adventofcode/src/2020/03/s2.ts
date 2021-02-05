import { FileUtils } from "../../utils/index";

function treeCount(map: string[][], xslope: number, yslope: number) {
    const worldWidth = map[0].length;
    let x = 0;
    let y = 0;
    let trees = 0;
    while (y < map.length) {
        if (map[y][x] === "#") {
            trees++;
        }
        x += xslope;
        if (x > worldWidth - 1) {
            x -= worldWidth;
        }
        y += yslope;
    }
    return trees;
}

FileUtils.readFileToLines("data/2020/03/input.txt").then((data) => {
    const map = data.map((item) => item.split(""));

    console.log(
        treeCount(map, 1, 1) *
            treeCount(map, 3, 1) *
            treeCount(map, 5, 1) *
            treeCount(map, 7, 1) *
            treeCount(map, 1, 2)
    );
});

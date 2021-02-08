import { FileUtils } from "../../utils/index";

// const INPUT = "data/2020/11/input_example";
const INPUT = "data/2020/11/input";

function adjacentCount(
    seats: string[][],
    iMax: number,
    jMax: number,
    iVal: number,
    jVal: number,
    char: string
) {
    let count = 0;
    for (let jj = -1; jj <= 1; jj++) {
        const jtmp = jVal + jj;
        for (let ii = -1; ii <= 1; ii++) {
            const itmp = iVal + ii;
            if (
                itmp >= 0 &&
                itmp <= iMax &&
                jtmp >= 0 &&
                jtmp <= jMax &&
                !(ii === 0 && jj === 0) &&
                seats[itmp][jtmp] === char
            ) {
                count++;
            }
        }
    }
    return count;
}

FileUtils.readFileToLines(INPUT).then((data) => {
    const iMax = data.length - 1;
    const jMax = data[0].length - 1;

    let seats = data.map((item) => item.split(""));
    let count = -1;
    let newCount = 0;
    while (newCount != count) {
        // for (let row of seats) {
        //     console.log(row.join(""));
        // }
        // console.log(count, newCount);

        count = newCount;

        let newSeats = seats.map((row) => row.slice());

        for (let jj = 0; jj <= jMax; jj++) {
            for (let ii = 0; ii <= iMax; ii++) {
                if (seats[ii][jj] === "L") {
                    if (adjacentCount(seats, iMax, jMax, ii, jj, "#") === 0) {
                        newSeats[ii][jj] = "#";
                    }
                } else if (seats[ii][jj] === "#") {
                    if (adjacentCount(seats, iMax, jMax, ii, jj, "#") >= 4) {
                        newSeats[ii][jj] = "L";
                    }
                }
            }
        }
        newCount = 0;
        for (let jj = 0; jj <= jMax; jj++) {
            for (let ii = 0; ii <= iMax; ii++) {
                if (newSeats[ii][jj] === "#") {
                    newCount++;
                }
            }
        }

        seats = newSeats.map((row) => row.slice());
    }
    console.log(count);
});

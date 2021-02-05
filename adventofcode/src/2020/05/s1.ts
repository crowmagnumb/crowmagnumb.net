import { FileUtils } from "../../utils/index";

type MinMax = {
    min: number;
    max: number;
};

function getSection(lowerChar: string, char: string, mm: MinMax) {
    const half = (mm.max - mm.min + 1) / 2;
    if (char === lowerChar) {
        return {
            min: mm.min,
            max: mm.max - half,
        } as MinMax;
    }

    return {
        min: mm.min + half,
        max: mm.max,
    } as MinMax;
}

FileUtils.readFileToLines("data/2020/05/input.txt").then((data) => {
    let maxSeatID: number = 0;
    for (const pass of data) {
        const rowCode = pass.slice(0, 7).split("");
        const colCode = pass.slice(7).split("");

        let rowMM = { min: 0, max: 127 } as MinMax;
        for (const char of rowCode) {
            rowMM = getSection("F", char, rowMM);
            // console.log(char, rowMM);
        }
        let colMM = { min: 0, max: 7 } as MinMax;
        for (const char of colCode) {
            colMM = getSection("L", char, colMM);
            // console.log(char, colMM);
        }
        // console.log(pass, rowMM, colMM);
        const seatID = rowMM.min * 8 + colMM.min;
        if (seatID > maxSeatID) {
            maxSeatID = seatID;
        }
    }
    console.log(maxSeatID);
});

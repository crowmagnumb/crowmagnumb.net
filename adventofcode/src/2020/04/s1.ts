import { FileUtils } from "../../utils/index";

const REQUIRED_KEYS = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];

FileUtils.readFileToLines("data/2020/04/input.txt").then((data) => {
    const passports: Map<string, string>[] = [];
    let passport = new Map<string, string>();
    passports.push(passport);

    for (const item of data) {
        if (item === "") {
            passport = new Map<string, string>();
            passports.push(passport);
        } else {
            for (const pair of item.split(" ")) {
                let pairs = pair.split(":");
                passport.set(pairs[0], pairs[1]);
            }
        }
    }

    let valid = 0;
    for (const passport of passports) {
        const keys = new Set(Array.from(passport.keys()));
        let keyCount = 0;
        for (const key of REQUIRED_KEYS) {
            if (keys.has(key)) {
                keyCount++;
            }
        }
        if (keyCount === REQUIRED_KEYS.length) {
            valid++;
        }
    }
    console.log(valid);
});

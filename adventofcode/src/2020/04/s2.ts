import { FileUtils } from "../../utils/index";

// byr (Birth Year) - four digits; at least 1920 and at most 2002.
// iyr (Issue Year) - four digits; at least 2010 and at most 2020.
// eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
// hgt (Height) - a number followed by either cm or in:
//     If cm, the number must be at least 150 and at most 193.
//     If in, the number must be at least 59 and at most 76.
// hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
// ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
// pid (Passport ID) - a nine-digit number, including leading zeroes.
// cid (Country ID) - ignored, missing or not.

const REQUIRED_KEYS = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];
const REQUIRED_EYE = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];

function markNotValid(key: string, value: string | undefined) {
    // console.log(key, value);
    return true;
}

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

    let validTotal = 0;
    // console.log(passports.length);
    for (const passport of passports) {
        const keys = new Set(Array.from(passport.keys()));

        let notValid = false;
        let keyCount = 0;
        for (const key of REQUIRED_KEYS) {
            if (keys.has(key)) {
                keyCount++;
            }

            const value = passport.get(key);
            if (!value) {
                notValid = markNotValid(key, value);
                break;
            }

            switch (key) {
                case "byr": {
                    const year = parseInt(value);
                    if (value.length === 4 && year >= 1920 && year <= 2002) {
                    } else {
                        notValid = markNotValid(key, value);
                    }
                    break;
                }
                case "iyr": {
                    const year = parseInt(value);
                    if (value.length === 4 && year >= 2010 && year <= 2020) {
                    } else {
                        notValid = markNotValid(key, value);
                    }
                    break;
                }
                case "eyr": {
                    const year = parseInt(value);
                    if (value.length === 4 && year >= 2020 && year <= 2030) {
                    } else {
                        notValid = markNotValid(key, value);
                    }
                    break;
                }
                case "hgt": {
                    let index = value.indexOf("cm");
                    if (index > 0) {
                        const hgt = parseInt(value.substring(0, index));
                        if (hgt >= 150 && hgt <= 193) {
                        } else {
                            notValid = markNotValid(key, value);
                        }
                    } else {
                        index = value.indexOf("in");
                        if (index > 0) {
                            const hgt = parseInt(value.substring(0, index));
                            if (hgt >= 59 && hgt <= 76) {
                            } else {
                                notValid = markNotValid(key, value);
                            }
                        } else {
                            notValid = markNotValid(key, value);
                        }
                    }
                    break;
                }
                case "hcl": {
                    if (value.match(/^#[0-9a-fA-F]{6}$/g)) {
                    } else {
                        notValid = markNotValid(key, value);
                    }
                    break;
                }
                case "ecl": {
                    if (REQUIRED_EYE.includes(value)) {
                    } else {
                        notValid = markNotValid(key, value);
                    }
                    break;
                }
                case "pid": {
                    if (value.match(/^[0-9]{9}$/g)) {
                    } else {
                        notValid = markNotValid(key, value);
                    }
                    break;
                }
            }
            if (notValid) {
                break;
            }
        }

        if (keyCount === REQUIRED_KEYS.length && !notValid) {
            validTotal++;
        }
    }
    console.log(validTotal);
});

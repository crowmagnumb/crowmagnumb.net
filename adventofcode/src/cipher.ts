//
// To run ...
//    npx ts src/cipher.ts; node dist/cipher.js
//
import { FileUtils } from "./utils";

// const inputs = ["xm", "dnexme", "krxmr"];
// const inputs = ["hittf", "ftt", "till"];
// const inputs = ["hittf", "ftt", "till", "klt"];
// const inputs = ["tgilliexbruxxmrimref"];
const inputs = ["slattmt", "sdfttme", "ftt"];
// let count = 0;
// const wordlist = "../../words_alpha.txt";
// const wordlist = "../../wordlist.txt";
const wordlist = "../../swe_wordlist.txt";

FileUtils.readFileToLines(wordlist, true).then((data) => {
    for (const line of data) {
        // vamjramje
        if (
            line.length === 6 &&
            line.endsWith("uset")
            // line.charAt(2) === "r" &&
            // line.charAt(0) === "h"
            // line.charAt(4) === "r" &&
            // line.charAt(5) === "a" &&
            // line.charAt(8) === "e"
        ) {
            console.log(line);
        }
    }
});

// FileUtils.readFileToLines(wordlist, true).then((data) => {
//     function checkCipher(
//         cipher: Map<string, string>,
//         input: string,
//         line: string
//     ) {
//         for (let ii = 0; ii < line.length; ii++) {
//             let ans = line.charAt(ii);
//             let char = input.charAt(ii);
//             let check = cipher.get(char);
//             if (check) {
//                 if (check !== ans) {
//                     return false;
//                 }
//             } else {
//                 let values = new Set(cipher.values());
//                 //
//                 // Can't have two chars mapping to the same ans.
//                 //
//                 if (values.has(ans)) {
//                     return false;
//                 }
//                 cipher.set(char, ans);
//             }
//         }
//         return true;
//     }

//     let ciphers: Map<string, string>[] = [];
//     let oldCiphers: Map<string, string>[] = [];
//     for (const input of inputs) {
//         ciphers = [];
//         for (const line of data) {
//             if (input.length === line.length) {
//                 if (oldCiphers.length) {
//                     for (const c of oldCiphers) {
//                         let cipher = new Map(c);
//                         if (checkCipher(cipher, input, line)) {
//                             ciphers.push(cipher);
//                         }
//                     }
//                 } else {
//                     const cipher = new Map<string, string>();
//                     if (checkCipher(cipher, input, line)) {
//                         ciphers.push(cipher);
//                     }
//                 }
//             }
//         }
//         oldCiphers = ciphers;
//     }

//     for (const cipher of ciphers) {
//         console.log(
//             inputs
//                 .map((input) =>
//                     input
//                         .split("")
//                         .map((char) => {
//                             let ans = cipher.get(char);
//                             return ans || "_";
//                         })
//                         .join("")
//                 )
//                 .join(" ")
//         );
//         // for (const input of inputs) {
//         //     console.log(

//         //     );
//         // }
//     }
//     console.log(ciphers.length);

//     // for (const line of data) {
//     //     // count++;
//     //     // if (count > 10) {
//     //     //     break;
//     //     // }

//     //     if (line.length === 5) {
//     //         const chars = new Set<string>();
//     //         for (let ii = 0; ii < line.length; ii++) {
//     //             chars.add(line.charAt(ii));
//     //         }
//     //         if (chars.size === 4 && line.charAt(2) === line.charAt(3)) {
//     //             // console.log(line);
//     //             words.push(line);
//     //         }
//     //     }
//     // }

//     // for (const line of data) {
//     //     if (line.length === 3) {
//     //         for (const word of words) {
//     //             if (
//     //                 line.charAt(0) === word.charAt(4) &&
//     //                 line.charAt(1) === word.charAt(2) &&
//     //                 line.charAt(2) === word.charAt(2)
//     //             ) {
//     //                 console.log(word, line);
//     //             }
//     //         }
//     //     }
//     // }
// });

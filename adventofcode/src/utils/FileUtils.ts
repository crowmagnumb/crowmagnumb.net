import * as fs from "fs";

export class FileUtils {
    static readFile(filename: string): Promise<string> {
        return new Promise(function (resolve, reject) {
            fs.readFile(filename, "utf8", (err: any, data: string) => {
                if (err) {
                    reject(err);
                }

                resolve(data);
            });
        });
    }

    static readFileToLines(filename: string) {
        return this.readFile(filename).then((data) => {
            const result = data.split("\n");
            //
            // Check for empty last line.
            //
            if (result[result.length - 1] === "") {
                return result.slice(0, result.length - 1);
            }
            return result;
        });
    }
}

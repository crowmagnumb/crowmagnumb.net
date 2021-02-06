import { FileUtils } from "../../utils/index";

type Content = {
    quantity: number;
    bagType: string;
};

function countContents(
    bagTypes: Map<string, Content[]>,
    bagType: string,
    startCount: number
) {
    let count = 0;
    let contents = bagTypes.get(bagType);
    if (contents) {
        for (const content of contents) {
            count +=
                content.quantity * countContents(bagTypes, content.bagType, 1);
        }
    }
    return startCount + count;
}

FileUtils.readFileToLines("data/2020/07/input.txt").then((data) => {
    const bagTypes = new Map<string, Content[]>();
    for (const item of data) {
        const parts = item.split(" bags contain ");
        const bagType = parts[0];
        const contents = parts[1].split(", ").map((stuff) => {
            let bagIndex = stuff.indexOf(" bag");
            if (stuff.startsWith("no")) {
                return {
                    quantity: 0,
                    bagType: stuff.substring(0, bagIndex),
                } as Content;
            }
            let spaceIndex = stuff.indexOf(" ");
            return {
                quantity: parseInt(stuff.substring(0, spaceIndex)),
                bagType: stuff.substring(spaceIndex + 1, bagIndex),
            } as Content;
        });

        bagTypes.set(bagType, contents);
    }

    console.log(countContents(bagTypes, "shiny gold", 0));
});

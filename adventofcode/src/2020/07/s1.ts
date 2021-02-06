import { FileUtils } from "../../utils/index";

type Content = {
    quantity: number;
    bagType: string;
};

function containsBag(
    bagTypes: Map<string, Content[]>,
    bagType: string,
    searchBagType: string
) {
    // console.log(bagType);
    let contains = false;
    let contents = bagTypes.get(bagType);
    if (!contents) {
        if (bagType !== "no other") {
            console.log(`WARNING: bagType [${bagType}] not found.`);
        }
    } else {
        for (const content of contents) {
            if (content.bagType === searchBagType) {
                contains = true;
                break;
            } else {
                if (containsBag(bagTypes, content.bagType, searchBagType)) {
                    contains = true;
                }
            }
        }
    }
    return contains;
}

FileUtils.readFileToLines("data/2020/07/input.txt").then((data) => {
    let count = 0;
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

        // console.log(bagType, contents);
        bagTypes.set(bagType, contents);
    }
    // console.log(bagTypes);

    for (const bagType of bagTypes.keys()) {
        // console.log("=========================");
        if (containsBag(bagTypes, bagType, "shiny gold")) {
            // console.log("YESSSSSSSS");
            count++;
        }
    }
    console.log(count);
});

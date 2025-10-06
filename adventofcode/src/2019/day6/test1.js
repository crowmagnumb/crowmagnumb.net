const { buildMap } = require("./day6.js");

const testdata = `COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L`;

const objmap = buildMap(testdata.split("\n"));
console.log(objmap.get("COM").totalOrbitCount());

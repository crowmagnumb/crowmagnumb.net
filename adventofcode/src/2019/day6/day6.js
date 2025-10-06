class TreeNode {
  constructor(obj) {
    this.obj = obj;
    this.bodies = [];
  }

  add(obj) {
    this.bodies.push(obj);
  }

  totalOrbitCount(result = { count: 0 }, depth = 0) {
    result.count += depth;
    for (let body of this.bodies) {
      body.totalOrbitCount(result, depth + 1);
    }
    return result.count;
  }

  depthOfChild(node) {
    return this.lineage(node).length;
  }

  lineage(node, result = { lineage: null, found: false }, lineage = []) {
    if (node.obj === this.obj) {
      result.lineage = lineage;
      result.found = true;
      return result.lineage;
    }
    for (const body of this.bodies) {
      body.lineage(node, result, [...lineage, body]);
      if (result.found) {
        return result.lineage;
      }
    }
    return result.lineage;
  }
}

exports.buildMap = function(data) {
  let objmap = new Map();

  function getNode(obj) {
    let node = objmap.get(obj);
    if (!node) {
      node = new TreeNode(obj);
      objmap.set(obj, node);
    }
    return node;
  }

  for (let orbdef of data) {
    let objs = orbdef.split(")");
    getNode(objs[0]).add(getNode(objs[1]));
  }
  return objmap;
};

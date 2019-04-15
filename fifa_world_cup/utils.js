const fs = require("fs");
const path = require("path");
const showdown = require("showdown");

const converter = new showdown.Converter({ tables: true });

function getVersion() {
  return process.argv[2];
}

exports.getWCVersion = getVersion;

exports.getFilePath = function(filename) {
  return path.join(`wc-${getVersion()}`, filename);
};

exports.markdown2Html = function(markdown) {
  return converter.makeHtml(markdown);
};

exports.writeHtml = function(bodyInnerHTML, outputFile) {
  fs.writeFile(
    outputFile,
    `<html><head><link type="text/css" rel="stylesheet" href="../github.css"></link><link type="text/css" rel="stylesheet" href="../fifa.css"></link></head><body>\n${bodyInnerHTML}</body></html>`,
    err => {
      if (err) {
        throw err;
      }
    }
  );
};

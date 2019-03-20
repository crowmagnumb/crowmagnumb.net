const fs = require("fs");
const path = require("path");
const showdown = require("showdown");

function getWCversion() {
    return process.argv[2];
}

exports.getFilePath = function(filename) {
    return path.join(getWCversion(), filename);
};

exports.markdown2Html = function(contents, ouputFile) {
    const converter = new showdown.Converter({ tables: true });
    const body = converter.makeHtml(contents);
    fs.writeFile(
        ouputFile,
        `<html><head><link type="text/css" rel="stylesheet" href="../github.css"></head><body>\n${body}</body></html>`,
        err => {
            if (err) {
                throw err;
            }
        }
    );
};

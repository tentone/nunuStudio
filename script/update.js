const common = require("./common");

console.log("----------------------------------------------------------------------");
console.log("                              nunuStudio");
console.log("                     Update dependencies (three.js, codemirror)");
console.log("----------------------------------------------------------------------");

const threejsURL = "https://rawgit.com/mrdoob/three.js/dev";
const threejsPath = "../lib/three";
common.downloadFolder(threejsPath, threejsURL + "/examples/js", true);
common.download(threejsPath + "/three.js", threejsURL + "/build/three.js");

const codemirrorURL = "https://rawgit.com/codemirror/CodeMirror/master";
const codemirrorPath = "../lib/codemirror";
common.downloadFolder(codemirrorPath + "/keymap", codemirrorURL + "/keymap", false);
common.downloadFolder(codemirrorPath + "/addon", codemirrorURL + "/addon", false);
common.downloadFolder(codemirrorPath + "/theme", codemirrorURL + "/theme", false);
common.download(codemirrorPath + "/codemirror.css", codemirrorURL + "/lib/codemirror.css");

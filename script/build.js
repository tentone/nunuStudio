const fs = require("fs");
const path = require("path");

const SOURCE_PATH = "../";
const OUTPUT_PATH = "../build/";

const RUNTIME_MAIN = "source/runtime/NunuApp.js";
const EDITOR_MAIN = "source/editor/Main.js";

const INPUT_JS_MODE = "ECMASCRIPT6";
const OUTPUT_JS_MODE = "ECMASCRIPT5";

console.log("----------------------------------------------------------------------");
console.log("                              Build Release");
console.log("----------------------------------------------------------------------");

console.log(" Reading package.json");
const packageData = JSON.parse(readFile(SOURCE_PATH + "package.json"));

console.log(" Joining files");
let out = join(SOURCE_PATH, SOURCE_PATH + EDITOR_MAIN);

console.log(" Filling build info");
out.js = addTimestamp("<PLACEHOLDER_TIMESTAMP>", out.js);
out.js = out.js.replace("<PLACEHOLDER_VERSION>", packageData.version);

const branch = require("child_process").execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
const commit = require("child_process").execSync("git rev-parse HEAD").toString().trim();

out.js = out.js.replace("<PLACEHOLDER_REPOSITORY_BRANCH>", branch);
out.js = out.js.replace("<PLACEHOLDER_REPOSITORY_COMMIT>", commit);

writeFile(OUTPUT_PATH + "nunu.editor.js.temp", out.js);

console.log(" Compressing CSS");
const css = compressCSS(out.css);
writeFile(OUTPUT_PATH + "nunu.editor.css", css);

console.log(" Optimizing with closure");
closure("SIMPLE", "PRETTY_PRINT", INPUT_JS_MODE, OUTPUT_JS_MODE, OUTPUT_PATH + "nunu.editor.js.temp", OUTPUT_PATH + "nunu.editor.js");

console.log(" Minifyng with closure");
closure("WHITESPACE_ONLY", "SINGLE_QUOTES", OUTPUT_JS_MODE, OUTPUT_JS_MODE, OUTPUT_PATH + "nunu.editor.js", OUTPUT_PATH + "nunu.editor.min.js");

console.log(" Removing temporary files");
deleteFile(OUTPUT_PATH + "nunu.editor.js");
deleteFile(OUTPUT_PATH + "nunu.editor.js.temp");

console.log("----------------------------------------------------------------------");
console.log("                              Build Runtime");
console.log("----------------------------------------------------------------------");
console.log(" Joining files");
out = join(SOURCE_PATH, SOURCE_PATH + RUNTIME_MAIN);
out.js = addTimestamp("DEVELOPMENT_VERSION", out.js);
writeFile(OUTPUT_PATH + "nunu.js.temp", out.js);

console.log(" Optimizing with closure");
closure("SIMPLE", "PRETTY_PRINT", INPUT_JS_MODE, OUTPUT_JS_MODE, OUTPUT_PATH + "nunu.js.temp", OUTPUT_PATH + "nunu.js");

console.log(" Minifyng with closure");
closure("WHITESPACE_ONLY", "SINGLE_QUOTES", OUTPUT_JS_MODE, OUTPUT_JS_MODE, OUTPUT_PATH + "nunu.js", OUTPUT_PATH + "nunu.min.js");

console.log(" Removing temporary files");
deleteFile(OUTPUT_PATH + "nunu.js.temp");

console.log(" Done!");

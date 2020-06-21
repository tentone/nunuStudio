const common = require('./common');

const SOURCE_PATH = "../";
const OUTPUT_PATH = "../build/";

const RUNTIME_MAIN = "source/runtime/NunuApp.js";
const EDITOR_MAIN = "source/editor/Main.js";

const INPUT_JS_MODE = "ECMASCRIPT6";
const OUTPUT_JS_MODE = "ECMASCRIPT5";

console.log("----------------------------------------------------------------------");
console.log("                              Build Editor");
console.log("----------------------------------------------------------------------");

console.log(" Reading package.json");
let packageData = JSON.parse(common.readFile(SOURCE_PATH + "package.json"));

console.log(" Updating version in package.json");
packageData.version = common.updateVersion(packageData.version, 0, 0, 1);

console.log(" Write package.json");
common.writeFile(SOURCE_PATH + "package.json", JSON.stringify(packageData, null, "\t"));

console.log(" Joining files");
let editor = common.join(SOURCE_PATH, SOURCE_PATH + EDITOR_MAIN);

console.log(" Filling build info");
editor.js = common.addTimestamp("<PLACEHOLDER_TIMESTAMP>", editor.js);
editor.js = editor.js.replace("<PLACEHOLDER_VERSION>", packageData.version);

const branch = require("child_process").execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
const commit = require("child_process").execSync("git rev-parse HEAD").toString().trim();

editor.js = editor.js.replace("<PLACEHOLDER_REPOSITORY_BRANCH>", branch);
editor.js = editor.js.replace("<PLACEHOLDER_REPOSITORY_COMMIT>", commit);

common.writeFile(OUTPUT_PATH + "nunu.editor.js.temp", editor.js);

console.log(" Compressing CSS");
const css = common.compressCSS(editor.css);
common.writeFile(OUTPUT_PATH + "nunu.editor.css", css);

console.log(" Optimizing with closure");
common.closure("SIMPLE", "PRETTY_PRINT", INPUT_JS_MODE, OUTPUT_JS_MODE, OUTPUT_PATH + "nunu.editor.js.temp", OUTPUT_PATH + "nunu.editor.js");

console.log(" Minifyng with closure");
common.closure("WHITESPACE_ONLY", "SINGLE_QUOTES", OUTPUT_JS_MODE, OUTPUT_JS_MODE, OUTPUT_PATH + "nunu.editor.js", OUTPUT_PATH + "nunu.editor.min.js");

console.log(" Removing temporary files");
common.deleteFile(OUTPUT_PATH + "nunu.editor.js");
common.deleteFile(OUTPUT_PATH + "nunu.editor.js.temp");

console.log("----------------------------------------------------------------------");
console.log("                              Build Runtime");
console.log("----------------------------------------------------------------------");

console.log(" Joining files");
let runtime = common.join(SOURCE_PATH, SOURCE_PATH + RUNTIME_MAIN);
runtime.js = common.addTimestamp("DEVELOPMENT_VERSION", runtime.js);
common.writeFile(OUTPUT_PATH + "nunu.js.temp", runtime.js);

console.log(" Optimizing with closure");
common.closure("SIMPLE", "PRETTY_PRINT", INPUT_JS_MODE, OUTPUT_JS_MODE, OUTPUT_PATH + "nunu.js.temp", OUTPUT_PATH + "nunu.js");

console.log(" Minifyng with closure");
common.closure("WHITESPACE_ONLY", "SINGLE_QUOTES", OUTPUT_JS_MODE, OUTPUT_JS_MODE, OUTPUT_PATH + "nunu.js", OUTPUT_PATH + "nunu.min.js");

console.log(" Removing temporary files");
common.deleteFile(OUTPUT_PATH + "nunu.js.temp");

console.log(" Done!");

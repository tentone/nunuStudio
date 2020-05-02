const common = require('./common');

const WAIT_FOR_KEY = false;

const SOURCE_PATH = "../";
const OUTPUT_PATH = "../build/";

const RUNTIME_MAIN = "source/runtime/NunuApp.js";
const EDITOR_MAIN = "source/editor/Main.js";

const EDITOR_OUTPUT_PATH = "../docs/editor/";

const DOCS_SOURCE_PATH = SOURCE_PATH + "source/core/";
const DOCS_OUTPUT_PATH = "../docs/docs";
const DOCS_THEME_PATH = "../docs/theme";

const INPUT_JS_MODE = "ECMASCRIPT6";
const OUTPUT_JS_MODE = "ECMASCRIPT5";

console.log("----------------------------------------------------------------------");
console.log("                              nunuStudio");
console.log("                    github.com/tentone/nunuStudio");
console.log("----------------------------------------------------------------------");
console.log("                                Editor");
console.log("----------------------------------------------------------------------");

console.log(" Updating version in package.json");
common.updateVersion(0, 0, 1);

console.log(" Reading package.json");
const packageData = JSON.parse(readFile(SOURCE_PATH + "package.json"));

console.log(" Joining files");
var out = join(SOURCE_PATH, SOURCE_PATH + EDITOR_MAIN);

console.log(" Filling build info");
out.js = common.addTimestamp("<PLACEHOLDER_TIMESTAMP>", out.js);
out.js = out.js.replace("<PLACEHOLDER_VERSION>", packageData.version);

const branch = require("child_process").execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
const commit = require("child_process").execSync("git rev-parse HEAD").toString().trim();

out.js = out.js.replace("<PLACEHOLDER_REPOSITORY_BRANCH>", branch);
out.js = out.js.replace("<PLACEHOLDER_REPOSITORY_COMMIT>", commit);

common.writeFile(OUTPUT_PATH + "nunu.editor.js.temp", out.js);

console.log(" Compressing CSS");
const css = common.compressCSS(out.css);
common.writeFile(OUTPUT_PATH + "nunu.editor.css", css);

console.log(" Optimizing with closure");
common.closure("SIMPLE", "PRETTY_PRINT", INPUT_JS_MODE, OUTPUT_JS_MODE, OUTPUT_PATH + "nunu.editor.js.temp", OUTPUT_PATH + "nunu.editor.js");

console.log(" Minifyng with closure");
common.closure("WHITESPACE_ONLY", "SINGLE_QUOTES", OUTPUT_JS_MODE, OUTPUT_JS_MODE, OUTPUT_PATH + "nunu.editor.js", OUTPUT_PATH + "nunu.editor.min.js");

console.log(" Removing temporary files");
common.deleteFile(OUTPUT_PATH + "nunu.editor.js");
common.deleteFile(OUTPUT_PATH + "nunu.editor.js.temp");

console.log("----------------------------------------------------------------------");
console.log("                              Runtime");
console.log("----------------------------------------------------------------------");
console.log(" Joining files");
var out = join(SOURCE_PATH, SOURCE_PATH + RUNTIME_MAIN);
out.js = addTimestamp("DEVELOPMENT_VERSION", out.js);
common.writeFile(OUTPUT_PATH + "nunu.js.temp", out.js);

console.log(" Optimizing with closure");
common.closure("SIMPLE", "PRETTY_PRINT", INPUT_JS_MODE, OUTPUT_JS_MODE, OUTPUT_PATH + "nunu.js.temp", OUTPUT_PATH + "nunu.js");

console.log(" Minifyng with closure");
common.closure("WHITESPACE_ONLY", "SINGLE_QUOTES", OUTPUT_JS_MODE, OUTPUT_JS_MODE, OUTPUT_PATH + "nunu.js", OUTPUT_PATH + "nunu.min.js");

console.log(" Removing temporary files");
common.deleteFile(OUTPUT_PATH + "nunu.js.temp");

console.log("----------------------------------------------------------------------");
console.log("                           Updating Webpage");
console.log("----------------------------------------------------------------------");
console.log(" Removing old editor files");
common.deleteFolder(EDITOR_OUTPUT_PATH + "source/files");
common.deleteFolder(EDITOR_OUTPUT_PATH + "source/runtime");
common.deleteFolder(EDITOR_OUTPUT_PATH + "source");

console.log(" Copying editor files");
common.makeDirectory(EDITOR_OUTPUT_PATH + "source");
common.copyFolder(SOURCE_PATH + "source/files", EDITOR_OUTPUT_PATH + "source/files");
common.copyFolder(SOURCE_PATH + "source/runtime", EDITOR_OUTPUT_PATH + "source/runtime");
common.copyFile(SOURCE_PATH + "source/favicon.ico", EDITOR_OUTPUT_PATH + "source/favicon.ico");
common.copyFile(SOURCE_PATH + "package.json", EDITOR_OUTPUT_PATH + "package.json");
common.writeFile(EDITOR_OUTPUT_PATH + "index.html", "<!DOCTYPE html>\
\
<html>\
	<head>\
		<meta charset=\"UTF-8\">\
		<meta http-equiv=\"content-type\" content=\"text/html; charset=ISO-8859-1\"/>\
		<meta name=\"description\" content=\"nunuStudio is a web based game engine for 3D and 2D game development with support for VR and AR\">\
		<meta name=\"keywords\" content=\"GameDev,Virtual Reality,Augmented Reality,JavaScript,JS,three.js\">\
		<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0\">\
	</head>\
\
	<body onload=\"Editor.initialize();\" onresize=\"Editor.resize();\">\
		<script type=\"text/javascript\" src=\"nunu.editor.min.js\"></script>\
		<link rel=\"stylesheet\" href=\"nunu.editor.css\">\
	</body>\
</html>");

console.log(" Copying editor build");
common.copyFile(OUTPUT_PATH + "nunu.min.js", EDITOR_OUTPUT_PATH + "nunu.min.js");
common.copyFile(OUTPUT_PATH + "nunu.editor.min.js", EDITOR_OUTPUT_PATH + "nunu.editor.min.js");
common.copyFile(OUTPUT_PATH + "nunu.editor.css", EDITOR_OUTPUT_PATH + "nunu.editor.css");

console.log("----------------------------------------------------------------------");
console.log("                      Generating documentation");
console.log("----------------------------------------------------------------------");
console.log(" Removing old files");
common.deleteFolder(DOCS_OUTPUT_PATH);

console.log(" Generating Docs");
const command = "yuidoc -o " + DOCS_OUTPUT_PATH + " -N -C -t " + DOCS_THEME_PATH + " -x lib " + DOCS_SOURCE_PATH;
require("child_process").execSync(command, function(error, stdout, stderr)
{
	console.log(stdout);
	console.log("");
});

if(WAIT_FOR_KEY)
{
	console.log("----------------------------------------------------------------------");
	console.log("                  Done! Press any key to exit");
	console.log("----------------------------------------------------------------------");
	process.stdin.setRawMode(true);
	process.stdin.resume();
	process.stdin.on("data", process.exit.bind(process, 0));
}
else
{
	console.log("----------------------------------------------------------------------");
	console.log("                                 Done!");
	console.log("----------------------------------------------------------------------");
}

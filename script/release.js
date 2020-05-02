const common = require('./common');

const SOURCE_PATH = "../";
const OUTPUT_PATH = "../build/";

const EDITOR_OUTPUT_PATH = "../docs/editor/";

const DOCS_SOURCE_PATH = SOURCE_PATH + "source/core/";
const DOCS_OUTPUT_PATH = "../docs/docs";
const DOCS_THEME_PATH = "../docs/theme";

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


console.log("----------------------------------------------------------------------");
console.log("                                 Done!");
console.log("----------------------------------------------------------------------");

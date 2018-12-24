"use strict";

/*
 * Include build and optimization script.
 * 
 * Requires java to be installed in order to optimize using Google closure.
 * 
 * yuidocjs used for documentation generation.
 *
 * @author tentone
 */
var fs = require("fs");
var path = require("path");

var WAIT_FOR_KEY = false;

var SOURCE_PATH = "../";
var OUTPUT_PATH = "../build/";

var RUNTIME_MAIN = "source/runtime/NunuApp.js";
var EDITOR_MAIN = "source/editor/Editor.js";

var EXAMPLES_PATH = "../docs/examples/";
var EDITOR_OUTPUT_PATH = "../docs/editor/";

var DOCS_SOURCE_PATH = SOURCE_PATH + "source/core/";
var DOCS_OUTPUT_PATH = "../docs/docs";
var DOCS_THEME_PATH = "../docs/theme";

//ECMASCRIPT5 | ECMASCRIPT6 | ECMASCRIPT_2017
var INPUT_JS_MODE = "ECMASCRIPT6";
var OUTPUT_JS_MODE = "ECMASCRIPT5";

console.log("----------------------------------------------------------------------");
console.log("                              nunuStudio");
console.log("                    github.com/tentone/nunuStudio");
console.log("----------------------------------------------------------------------");
console.log("                                Editor");
console.log("----------------------------------------------------------------------");

console.log(" Reading package.json");
var packageData = JSON.parse(readFile(SOURCE_PATH + "package.json"));

console.log(" Joining files");
var out = join(SOURCE_PATH, SOURCE_PATH + EDITOR_MAIN);

console.log(" Filling build info");
out.js = addTimestamp("<PLACEHOLDER_TIMESTAMP>", out.js);
out.js = out.js.replace("<PLACEHOLDER_VERSION>", packageData.version);

var branch = require("child_process").execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
var commit = require("child_process").execSync("git rev-parse HEAD").toString().trim();

out.js = out.js.replace("<PLACEHOLDER_REPOSITORY_BRANCH>", branch);
out.js = out.js.replace("<PLACEHOLDER_REPOSITORY_COMMIT>", commit);

writeFile(OUTPUT_PATH + "nunu.editor.js.temp", out.js);

console.log(" Compressing CSS");
var css = compressCSS(out.css);
writeFile(OUTPUT_PATH + "nunu.editor.css", css);

console.log(" Optimizing with closure");
closure("SIMPLE", "PRETTY_PRINT", INPUT_JS_MODE, OUTPUT_JS_MODE, OUTPUT_PATH + "nunu.editor.js.temp", OUTPUT_PATH + "nunu.editor.js");

console.log(" Minifyng with closure");
closure("WHITESPACE_ONLY", "SINGLE_QUOTES", OUTPUT_JS_MODE, OUTPUT_JS_MODE, OUTPUT_PATH + "nunu.editor.js", OUTPUT_PATH + "nunu.editor.min.js");

console.log(" Removing temporary files");
deleteFile(OUTPUT_PATH + "nunu.editor.js");
deleteFile(OUTPUT_PATH + "nunu.editor.js.temp");

console.log("----------------------------------------------------------------------");
console.log("                              Runtime");
console.log("----------------------------------------------------------------------");
console.log(" Joining files");
var out = join(SOURCE_PATH, SOURCE_PATH + RUNTIME_MAIN);
out.js = addTimestamp("DEVELOPMENT_VERSION", out.js);
writeFile(OUTPUT_PATH + "nunu.js.temp", out.js);

console.log(" Optimizing with closure");
closure("SIMPLE", "PRETTY_PRINT", INPUT_JS_MODE, OUTPUT_JS_MODE, OUTPUT_PATH + "nunu.js.temp", OUTPUT_PATH + "nunu.js");

console.log(" Minifyng with closure");
closure("WHITESPACE_ONLY", "SINGLE_QUOTES", OUTPUT_JS_MODE, OUTPUT_JS_MODE, OUTPUT_PATH + "nunu.js", OUTPUT_PATH + "nunu.min.js");

console.log(" Removing temporary files");
deleteFile(OUTPUT_PATH + "nunu.js.temp");

console.log("----------------------------------------------------------------------");
console.log("                           Updating Webpage");
console.log("----------------------------------------------------------------------");
console.log(" Removing old editor files");
deleteFolder(EDITOR_OUTPUT_PATH + "source/files");
deleteFolder(EDITOR_OUTPUT_PATH + "source/runtime");
deleteFolder(EDITOR_OUTPUT_PATH + "source");

console.log(" Copying editor files");
makeDirectory(EDITOR_OUTPUT_PATH + "source");
copyFolder(SOURCE_PATH + "source/files", EDITOR_OUTPUT_PATH + "source/files");
copyFolder(SOURCE_PATH + "source/runtime", EDITOR_OUTPUT_PATH + "source/runtime");
copyFile(SOURCE_PATH + "source/favicon.ico", EDITOR_OUTPUT_PATH + "source/favicon.ico");
copyFile(SOURCE_PATH + "package.json", EDITOR_OUTPUT_PATH + "package.json");
writeFile(EDITOR_OUTPUT_PATH + "index.html", "<!DOCTYPE html>\
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
copyFile(OUTPUT_PATH + "nunu.min.js", EDITOR_OUTPUT_PATH + "nunu.min.js");
copyFile(OUTPUT_PATH + "nunu.editor.min.js", EDITOR_OUTPUT_PATH + "nunu.editor.min.js");
copyFile(OUTPUT_PATH + "nunu.editor.css", EDITOR_OUTPUT_PATH + "nunu.editor.css");

console.log("----------------------------------------------------------------------");
console.log("                      Generating documentation");
console.log("----------------------------------------------------------------------");
console.log(" Removing old files");
deleteFolder(DOCS_OUTPUT_PATH);

console.log(" Generating Docs");
var command = "yuidoc -o " + DOCS_OUTPUT_PATH + " -N -C -t " + DOCS_THEME_PATH + " -x lib " + DOCS_SOURCE_PATH;
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

function closure(level, formatting, languageIn, languageOut, fileIn, fileOut)
{
	var command = "java -jar closure.jar --compilation_level " + level + " --warning_level QUIET --formatting " + formatting + " --language_in " + languageIn + " --language_out " + languageOut + " --js " + fileIn + " --js_output_file " + fileOut;
	
	require("child_process").execSync(command, function(error, stdout, stderr)
	{
		if(stdout !== "")
		{
			console.log("Error compiling with google closure, check if java is installed and try again.");
		}
	});
}

function formatNumber(number)
{
	return ("0" + number).slice(-2);
}

function addTimestamp(keyword, code)
{
	var date = new Date();
	var timestamp = date.getFullYear() + formatNumber(date.getMonth() + 1) + formatNumber(date.getDate()) + formatNumber(date.getHours()) + formatNumber(date.getMinutes());

	return code.replace(keyword, timestamp);
}

function compressCSS(code)
{
	code = code.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '');
	code = code.replace(/ {2,}/g, ' ');
	code = code.replace(/ ([{:}]) /g, '$1');
	code = code.replace(/([;,]) /g, '$1');
	code = code.replace(/ !/g, '!');

	return code;
}

function removeJSComments(code)
{
	return code.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, "");
}

function removeLogs(code)
{
	return code.replace(/console\.(error|log|warn|info)(.*)\;/gi, "");
}

function join(path, main)
{
	var code = readFile(main);
	var includes = getIncludes(code);

	var js = "", css = "";

	for(var i = 0; i < includes.length; i++)
	{
		if(includes[i].endsWith(".js"))
		{
			js += "\n" + readFile(path + includes[i]);
		}
		else if(includes[i].endsWith(".css"))
		{
			css += "\n" + readFile(path + includes[i]);
		}
		else if(includes[i].endsWith("*"))
		{
			var fs = require("fs");

			if(fs !== undefined)
			{
				var directory = includes[i].replace("*", "");
				var files = fs.readdirSync(path + directory);
				
				for(var j = 0; j < files.length; j++)
				{
					includes.push(directory + files[j]);
				}
			}
		}
	}
	
	js = code.replace(/"use strict";/gi, "").replace(/include\(".+?"\);/gi, "").replace(/^\s*\n/gm, "") + js;
	
	return {js: js, css: css};
}

function getIncludes(code, regex)
{
	if(regex === undefined)
	{
		regex = /include\([\"\'].+?[\"\']\);/g;
	}

	var results = [];
	var match = regex.exec(code);
	while(match !== null)
	{
		var files = /\(\s*([^)]+?)\s*\)/.exec(match[0]);
		if(files[1])
		{
			files = files[1].split(/\s*,\s*/);
		}

		for(var i = 0; i < files.length; i++)
		{
			results.push(files[i].replace(/[\"\']/gi, ""));
		}

		match = regex.exec(code);
	}

	return results;
}

function readFile(fname)
{
	return fs.readFileSync(fname, "utf8");
}

function writeFile(fname, text)
{
	function checkDirectory(pathName)
	{
		var dirname = path.dirname(pathName);
		if(fs.existsSync(dirname))
		{
			return true;
		}
		checkDirectory(dirname);
		fs.mkdirSync(dirname);
	}

	checkDirectory(fname);
	fs.writeFileSync(fname, text, "utf8");
}

function copyFolder(src, dst)
{
	makeDirectory(dst);
	var files = fs.readdirSync(src);

	for(var i = 0; i < files.length; i++)
	{
		var source = src + "/" + files[i];
		var destiny = dst + "/" + files[i];
		var current = fs.statSync(source);
		
		//Directory
		if(current.isDirectory())
		{
			copyFolder(source, destiny);
		}
		//Symbolic link
		else if(current.isSymbolicLink())
		{
			fs.symlinkSync(fs.readlinkSync(source), destiny);
		}
		//File
		else
		{
			copyFile(source, destiny);
		}
	}
}

function copyFile(src, dst)
{
	fs.copyFileSync(src, dst);
}

function renameFile(oldPath, newPath)
{
	fs.renameSync(oldPath, newPath);
}

function makeDirectory(dir)
{
	if(!fs.existsSync(dir))
	{
		fs.mkdirSync(dir);
	}
}

function deleteFolder(path)
{
	if(fs.existsSync(path))
	{
		fs.readdirSync(path).forEach(function(file, index)
		{
			var curPath = path + "/" + file;

			if(fs.lstatSync(curPath).isDirectory())
			{
				deleteFolder(curPath);
			}
			else
			{
				fs.unlinkSync(curPath);
			}
		});

		fs.rmdirSync(path);
	}
}

function deleteFile(fname)
{
	fs.unlinkSync(fname);
}

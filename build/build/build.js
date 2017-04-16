"use strict";

var sourcePath = "../../source/";
var buildPath = "../";

var runtimeMain = "runtime/NunuApp.js";
var editorMain = "Editor.js";

var examplesPath = "../../docs/examples/";
var editorWebPath = "../../docs/editor/";

var docsPath = "../../docs/docs";
var docsThemePath = "../../docs/theme";

console.log("----------------------------------------------------------------------");
console.log("                              nunuStudio");
console.log("                    github.com/tentone/nunuStudio");
console.log("----------------------------------------------------------------------");
console.log("                                Editor");
console.log("----------------------------------------------------------------------");
console.log(" Joining files");
var out = join(sourcePath, sourcePath + editorMain);
writeFile(buildPath + "nunu.editor.js.temp", out.js);
var css = compressCSS(out.css);
writeFile(buildPath + "nunu.editor.css", css);
console.log(" Optimizing with closure");
closure("SIMPLE", "PRETTY_PRINT", "ECMASCRIPT5", "ECMASCRIPT5", buildPath + "nunu.editor.js.temp", buildPath + "nunu.editor.js");
console.log(" Minifyng with closure");
closure("WHITESPACE_ONLY", "SINGLE_QUOTES", "ECMASCRIPT5", "ECMASCRIPT5", buildPath + "nunu.editor.js", buildPath + "nunu.editor.min.js");
console.log(" Removing temporary files");
deleteFile("../nunu.editor.js");
deleteFile("../nunu.editor.js.temp");

console.log("----------------------------------------------------------------------");
console.log("                              Runtime");
console.log("----------------------------------------------------------------------");
var out = join(sourcePath, sourcePath + runtimeMain);
writeFile(buildPath + "nunu.js.temp", out.js);
console.log(" Optimizing with closure");
closure("SIMPLE", "PRETTY_PRINT", "ECMASCRIPT5", "ECMASCRIPT5", buildPath + "nunu.js.temp", buildPath + "nunu.js");
console.log(" Minifyng with closure");
closure("WHITESPACE_ONLY", "SINGLE_QUOTES", "ECMASCRIPT5", "ECMASCRIPT5", buildPath + "nunu.js", buildPath + "nunu.min.js");
console.log(" Removing temporary files");
deleteFile(buildPath + "nunu.js");
deleteFile(buildPath + "nunu.js.temp");

console.log("----------------------------------------------------------------------");
console.log("                           Updating Webpage");
console.log("----------------------------------------------------------------------");
console.log(" Copying runtime build");
copyFile(buildPath + "nunu.min.js", examplesPath + "nunu.min.js");
console.log(" Removing old editor files");
deleteFolder(editorWebPath + "editor/files");
console.log(" Copying editor files");
copyFolder(sourcePath + "editor/files", editorWebPath + "editor/files");
console.log(" Copying editor build");
copyFile(buildPath + "nunu.editor.min.js", editorWebPath + "nunu.editor.min.js");
copyFile(buildPath + "nunu.editor.css", editorWebPath + "nunu.editor.css");

console.log("----------------------------------------------------------------------");
console.log("                      Generating documentation");
console.log("----------------------------------------------------------------------");
//console.log(" Installing YiuDocJS from NPM");
//require("child_process").execSync("npm -g install yuidocjs", function(error, stdout, stderr){});
console.log(" Removing old files");
deleteFolder("../../docs/docs");
console.log(" Generating Docs");
var command = "yuidoc -o " + docsPath + " -N -C -t " + docsThemePath + " -x lib " + sourcePath;
require("child_process").execSync(command, function(error, stdout, stderr)
{
	console.log(stdout);
	console.log("");
});

//console.log("----------------------------------------------------------------------");
//console.log("                       Packaging nunuStudio");
//console.log("----------------------------------------------------------------------");
//console.log(" Not implemented");

console.log("----------------------------------------------------------------------");
console.log("                  Done! Press any key to exit");
console.log("----------------------------------------------------------------------");
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on("data", process.exit.bind(process, 0));

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

function compressCSS(code)
{
	return code.replace(/(\/\*([\s\S]*?)\*\/)/gm, "").replace(new RegExp("\n\n", "g"), "\n");
}

function removeJSComments(code)
{
	return code.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, "");
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
	js += code;
	js = js.replace(/"use strict";/gi, "").replace(/include\(".+?"\);/gi, "").replace(/^\s*\n/gm, "") ;
	
	return {js: js, css: css};
}

function getIncludes(code, results)
{
	if(results === undefined)
	{
		results = [];
	}

	var index = code.search(/include\(".+?"\);/gi);
	if(index !== -1)
	{
		var sub = code.substring(index);
		var end = sub.indexOf("\");");
		var include = sub.substring(9, end);

		results.push(include);
		getIncludes(sub.substring(end), results);
	}

	return results;
}

function readFile(fname)
{
	var fs = require("fs");

	if(fs !== undefined)
	{
		return fs.readFileSync(fname, "utf8");
	}
}

function writeFile(fname, text)
{
	var fs = require("fs");

	if(fs !== undefined)
	{
		fs.writeFileSync(fname, text, "utf8");
	}
}

function copyFolder(src, dst)
{
	var fs = require("fs");

	if(fs !== undefined)
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
}

function copyFile(src, dst)
{
	var fs = require("fs");

	if(fs !== undefined)
	{
		fs.createReadStream(src).pipe(fs.createWriteStream(dst));
	}
}

function makeDirectory(dir)
{
	var fs = require("fs");

	if(fs !== undefined)
	{
		fs.mkdirSync(dir);
	}
}

function deleteFolder(path)
{
	var fs = require("fs");

	if(fs !== undefined)
	{
		if(fs.existsSync(path))
		{
			fs.readdirSync(path).forEach(function(file,index)
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
}

function deleteFile(fname)
{
	var fs = require("fs");

	if(fs !== undefined)
	{
		fs.unlinkSync(fname);
	}
}

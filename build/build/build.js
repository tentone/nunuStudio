"use strict";

console.log("------------------------");
console.log("       nunuStudio");
console.log("------------------------");
console.log("        Editor");
console.log("------------------------");
console.log(" Joining files");

var out = join("../../source/", "../../source/Editor.js");

writeFile("../nunu.editor.js.temp", out.js);
writeFile("../nunu.editor.css", out.css);

console.log(" Optimizing with closure");
closure("SIMPLE", "PRETTY_PRINT", "ECMASCRIPT5", "ECMASCRIPT5", "../nunu.editor.js.temp", "../nunu.editor.js");

console.log(" Minifyng with closure");
closure("WHITESPACE_ONLY", "SINGLE_QUOTES", "ECMASCRIPT5", "ECMASCRIPT5", "../nunu.editor.js", "../nunu.editor.min.js");

console.log(" Removing temporary files");
deleteFile("../nunu.editor.js");
deleteFile("../nunu.editor.js.temp");

console.log("------------------------");
console.log("        Runtime");
console.log("------------------------");

var out = join("../../source/", "../../source/runtime/NunuApp.js");

writeFile("../nunu.js.temp", out.js);

console.log(" Optimizing with closure");
closure("SIMPLE", "PRETTY_PRINT", "ECMASCRIPT5", "ECMASCRIPT5", "../nunu.js.temp", "../nunu.js");

console.log(" Minifyng with closure");
closure("WHITESPACE_ONLY", "SINGLE_QUOTES", "ECMASCRIPT5", "ECMASCRIPT5", "../nunu.js", "../nunu.min.js");

console.log(" Removing temporary files");
deleteFile("../nunu.js");
deleteFile("../nunu.js.temp");

console.log("------------------------");
console.log("    Updating Webpage");
console.log("------------------------");

console.log(" Copying runtime files");
copyFile("../nunu.min.js", "../../docs/examples/nunu.min.js");

console.log(" Copying editor files");
copyFile("../nunu.editor.min.js", "../../docs/editor/nunu.editor.min.js");
copyFile("../nunu.editor.css", "../../docs/editor/nunu.editor.css");

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

function join(path, main)
{
	//Join files
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
		src.replace(new RegExp("/", 'g'), "\\");
		dst.replace(new RegExp("/", 'g'), "\\");

		makeDirectory(dst);
		var files = fs.readdirSync(src);

		for(var i = 0; i < files.length; i++)
		{
			var source = src + "\\" + files[i];
			var destiny = dst + "\\" + files[i];
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
		src.replace(new RegExp("/", 'g'), "\\");
		dst.replace(new RegExp("/", 'g'), "\\");

		fs.createReadStream(src).pipe(fs.createWriteStream(dst));
	}
}

function makeDirectory(dir)
{
	var fs = require("fs");

	if(fs !== undefined)
	{
		dir.replace(new RegExp("/", 'g'), "\\");
		fs.mkdirSync(dir);
	}
}

function deleteFile(fname)
{
	var fs = require("fs");

	if(fs !== undefined)
	{
		fname.replace(new RegExp("/", 'g'), "\\");
		fs.unlink(fname);
	}
}

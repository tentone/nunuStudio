"use strict";

const utils = require('./utils');

const getIncludes = utils.getIncludes;
const readFile = utils.readFile;
const writeFile = utils.writeFile;

module.exports = function join(path, input, out_js, out_css) {
	console.log(' Joining Javascript files ');
	
	if (!path || !input || !out_js || !out_css) {
		console.log("Usage: <source_path> <main_js> <out_js> <out_css>");
	}
	
	//Join files
	var code = readFile(input);
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
	
	//Write Output
	const jsStream = writeFile(out_js, js);
	writeFile(out_css, css);
	
	// Return js stream so we can wait for it before acting on it (optimize / minify)
	return jsStream;
};
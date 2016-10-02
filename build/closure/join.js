"use strict";

var path = "../../source/";
var input = "../../source/runtime/Nunu.js";

var code = readFile(input);
var includes = getIncludes(code);
var output = "";
for(var i = 0; i < includes.length; i++)
{
	output += "\n" + readFile(path + includes[i]);
}
output += code;
output = output.replace(/"use strict";/gi, "").replace(/include\(".+?"\);/gi, "");
writeFile("out.js", output);

//Get included files
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
		results.push(sub.substring(9, end));
		getIncludes(sub.substring(end), results);
	}

	return results;
}

//Read file
function readFile(fname)
{
	var fs = require("fs");

	if(fs !== undefined)
	{
		return fs.readFileSync(fname, "utf8");
	}
}

//Write file
function writeFile(fname, text)
{
	var fs = require("fs");

	if(fs !== undefined)
	{
		var stream = fs.createWriteStream(fname, "utf8");
		stream.write(text);
		stream.end();
	}
}
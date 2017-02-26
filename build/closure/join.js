"use strict";

if(process.argv.length > 4)
{
	//Path for source code
	var path = process.argv[2];

	//Main javascript file inside of source code folder
	var input = process.argv[3];

	//JS Output file
	var out_js = process.argv[4];

	//CSS Output file
	var out_css = process.argv[5];

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
	writeFile(out_js, js);
	writeFile(out_css, css);
}
else
{
	console.log("Usage: <source_path> <main_js> <out_js> <out_css>")
}

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
		var include = sub.substring(9, end);

		results.push(include);
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
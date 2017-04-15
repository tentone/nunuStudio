const fs = require("fs");
const rimraf = require('rimraf');

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
	return fs.readFileSync(fname, "utf8");
}

//Write file
function writeFile(fname, text)
{
	var fs = require("fs");

	var stream = fs.createWriteStream(fname, "utf8");
	stream.write(text);
	stream.end();
	
	return stream;
}

//Clean files
function cleanFiles(jsPath, cssPath) {
	console.log(' Cleaning temporary files ');
    rimraf(jsPath, f => f);
    rimraf(cssPath, f => f);
}

module.exports = {
    getIncludes,
    writeFile,
    readFile,
    cleanFiles
};
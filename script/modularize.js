const common = require("./common");

console.log("----------------------------------------------------------------------");
console.log("                              nunuStudio");
console.log("                          Modularize Codebase");
console.log("----------------------------------------------------------------------");


// Represents a file to be modularized and some of its details
//
// These are used to connect the different files being modularized.
function CodeFile(fullPath, className, isModule)
{
	// Full path of the file
	this.fullPath = fullPath;

	// Name of the class declared in this code file
	this.className = className;

	// If the file is a code module
	this.isModule = isModule;
}

// Paths to get files from
var paths = ["../source/editor", "../source/core", "../source/runtime"];

// List of all files to be modularized
var files = [];

// Read files from all paths
for(var i = 0; i < paths.length; i++)
{
	// Get the files in the path
	var path = common.listFiles(paths[i], false, "");
	for(var j = 0; j < path.length; j++)
	{
		var fullPath = paths[i] + path[j];
		
		// Check if there is a class declared with the same name of the file
		var className = common.getFileNameNoExt(fullPath);
		var data = common.readFile(fullPath);
		var isModule = data.search("function " + className) >= 0;
		if(!isModule)
		{
			className = null;
		}

		files.push(new CodeFile(fullPath, className, isModule));
	}
}

// Iterate all the files to be modularized.
for(var i = 0; i < files.length; i++)
{
	var data = common.readFile(files[i].fullPath);

	// Remove the "use strict" declaration file
	data = data.replace("\"use strict\";", "");

	// Look for other modules and import them
	// TODO <ADD CODE HERE>

	// Look for CANNON usage/modules and import them
	// TODO <ADD CODE HERE>

	// Look for THREE usage/modules and import them
	// TODO <ADD CODE HERE>

	// Check if there is a class with name of the file
	if(files[i].isModule)
	{
		// Export the class of the file
		data += "\nexport {" + files[i].className + "};"
	}

	// Remove all duplicated lines
	data = data.replace("\n\n", "\n");

	// Write back
	// common.writeFile(files[i], data);

	// TODO <DEBUG CODE>
	if(files[i].className === "EffectComposer")
	{
		console.log(data, files[i]);
	}
}
const common = require("./common");

console.log("----------------------------------------------------------------------");
console.log("                              nunuStudio");
console.log("                          Modularize Codebase");
console.log("----------------------------------------------------------------------");

var files = common.listFiles("../source/editor", false, "");

for(var i = 0; i < files.length; i++)
{
	var data = common.readFile(files[i]);

	// Remove the "use strict" file
	data = data.replace("\"use strict\";", "");

	var fname = common.getFileName(files[i]);

	// Check if there is a class with name of the file
	// "function " + fname

	// Export the class of the file
	// data += "\n export {" + + "};"

	// Remove all duplicated lines
	data = data.replace("\n\n", "\n");

	// Write back
	// common.writeFile(files[i], data);
}
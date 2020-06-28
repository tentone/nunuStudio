const common = require("./common");

console.log("----------------------------------------------------------------------");
console.log("                              nunuStudio");
console.log("                          Modularize Codebase");
console.log("----------------------------------------------------------------------");


var external =
[
	{namespace: "THREE", package: "three", regex: new RegExp("THREE\.([A-Z][A-Za-z0-9]+)", "g")},
];


console.log(process.argv);

var file = "spine-threejs.js";

var data = common.readFile(file);


// Look for other modules and import them
for(var j = 0; j < external.length; j++)
{
	// Find all usages of the library
	var found = [];
	do
	{
		var result = external[j].regex.exec(data);
		if(result !== null && found.indexOf(result[1]) === -1)
		{
			found.push(result[1]);
		}
	} while(result !== null);
	
	// Replace by modules
	if(found.length > 0)
	{
		data = data.replace(external[j].regex, "$1");
		data = "import {" + found.join(", ") + "} from \"" + external[j].package + "\";\n" + data;			
	}
}


// Remove all duplicated lines
data = data.replace("\n\n", "\n");

// Write back
common.writeFile(file, data);
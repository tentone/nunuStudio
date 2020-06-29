// Script to import locale into editor files.

const common = require("./common");

var basePath = "../source/editor";

// Get the files in the path
var files = [];


var path = common.listFiles(basePath, false, "");
for(var j = 0; j < path.length; j++)
{
	files.push(basePath + path[j]);
}

var localePath = "../source/editor/locale/LocaleManager.js";


for(var i = 0; i < files.length; i++)
{
	if(files[i].search("Locale") >= 0)
	{
		continue;
	}

	var data = common.readFile(files[i]);

	if(files[i].endsWith("js") && data.search("Locale") >= 0)
	{
		data = "import {Locale} from \"" + common.calculateRelativePath(files[i], localePath) + "\";\n" + data;
	}

	common.writeFile(files[i], data);
}
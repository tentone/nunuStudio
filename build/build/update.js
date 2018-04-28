"use strict";

console.log("----------------------------------------------------------------------");
console.log("                              nunuStudio");
console.log("                    github.com/tentone/nunuStudio");
console.log("                           Update dependencies");
console.log("----------------------------------------------------------------------");
console.log("                               three.js");
console.log("----------------------------------------------------------------------");

var threejsURL = "https://rawgit.com/mrdoob/three.js/dev";
var threejsPath = "../../source/lib/three";

var files = listFiles(threejsPath, true, "");
for(var i = 0; i < files.length; i++)
{
	download(threejsURL + "/examples/js" + files[i], threejsPath + files[i]);
}
download(threejsURL + "/build/three.min.js", threejsPath + "/three.min.js");


function listFiles(path, ignoreRootFiles, virtualPath)
{
	var fs = require("fs");
	var files = [];

	fs.readdirSync(path).forEach(function(file, index)
	{
		var currentPath = path + "/" + file;
		var currentVirtualPath = virtualPath + "/" + file;

		if(fs.lstatSync(currentPath).isDirectory())
		{
			files = files.concat(listFiles(currentPath, false, currentVirtualPath));
		}
		else if(ignoreRootFiles === false)
		{
			files.push(currentVirtualPath);
		}
	});

	return files;
}

function makeDirectory(dir)
{
	var fs = require("fs");

	if(fs !== undefined)
	{
		fs.mkdirSync(dir);
	}
}

function download(url, fname)
{
	var http = require("https");
	var data = "";

	var request = http.get(url, function(response)
	{
		response.on("data", function(chunk)
		{
			data += chunk;
		});
		
		response.on("end", function()
		{
			writeFile(fname, data);
			console.log("Updated:" +  fname);
		});
	}).on("error", function(error)
	{
		console.log("Error:" + fname + "(" +  error + ")");
	});
}

function writeFile(fname, text)
{
	var fs = require("fs");
	var path = require("path");

	function checkDirectory(pathName)
	{
		var dirname = path.dirname(pathName);
		if(fs.existsSync(dirname))
		{
			return true;
		}
		checkDirectory(dirname);
		fs.mkdirSync(dirname);
	}

	checkDirectory(fname);
	fs.writeFileSync(fname, text, "utf8");
}

/*
function readFile(fname)
{
	var fs = require("fs");

	if(fs !== undefined)
	{
		return fs.readFileSync(fname, "utf8");
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

function deleteFile(fname)
{
	var fs = require("fs");

	if(fs !== undefined)
	{
		fs.unlinkSync(fname);
	}
}
*/

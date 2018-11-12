"use strict";

console.log("----------------------------------------------------------------------");
console.log("                              nunuStudio");
console.log("                    github.com/tentone/nunuStudio");
console.log("                           Update dependencies");
console.log("----------------------------------------------------------------------");

var threejsURL = "https://rawgit.com/mrdoob/three.js/dev";
var threejsPath = "../source/lib/three";

downloadFolder(threejsPath, threejsURL + "/examples/js", true);
download(threejsPath + "/three.min.js", threejsURL + "/build/three.min.js");

var codemirrorURL = "https://rawgit.com/codemirror/CodeMirror/master";
var codemirrorPath = "../source/lib/codemirror";

downloadFolder(codemirrorPath + "/keymap", codemirrorURL + "/keymap", false);
downloadFolder(codemirrorPath + "/addon", codemirrorURL + "/addon", false);
downloadFolder(codemirrorPath + "/theme", codemirrorURL + "/theme", false);
download(codemirrorPath + "/mode/javascript.js", codemirrorURL + "/mode/javascript/javascript.js");
download(codemirrorPath + "/codemirror.css", codemirrorURL + "/lib/codemirror.css");

function downloadFolder(basePath, baseURL, ignoreRootFiles)
{
	var files = listFiles(basePath + "/", ignoreRootFiles, "");
	for(var i = 0; i < files.length; i++)
	{
		download(basePath + files[i], baseURL + files[i]);
	}
} 

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

function download(fname, url)
{
	var http = require("https");
	var data = "";

	var request = http.get(url, function(response)
	{
		response.on("data", function(chunk)
		{
			data += chunk;
		});
		
		response.on("end", function(event)
		{
			if(data.search("404: Not Found") === -1)
			{
				writeFile(fname, data);
				console.log("Updated: " +  fname);
			}
			else
			{
				console.log("Failed: " +  fname);
			}

		});
	}).on("error", function(error)
	{
		console.log("Error: " + fname + ", " +  error);
	});
	request.end();
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

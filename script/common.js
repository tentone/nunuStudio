const fs = require("fs");
const path = require("path");

module.exports = {
	updateVersion: updateVersion,
	closure: closure,
	addTimestamp: addTimestamp,
	compressCSS: compressCSS,
	removeJSComments: removeJSComments,
	removeLogs: removeLogs,
	join: join,
	getIncludes: getIncludes,
	readFile: readFile,
	writeFile: writeFile,
	copyFolder: copyFolder,
	copyFile: copyFile,
	renameFile: renameFile,
	makeDirectory: makeDirectory,
	deleteFolder: deleteFolder,
	deleteFile: deleteFile,
	downloadFolder: downloadFolder,
	listFiles: listFiles,
	download: download
};

const CLOSURE_PATH = "../node_modules/google-closure-compiler-java/compiler.jar";

/**
 * Update the version of the library by adding to the current version.
 *
 * @param {string} data The object with the current version of the application.
 * @param {number} major How many to add to the major version.
 * @param {number} minor How many to add to the minor version.
 * @param {number} revision How many to add to the revision version.
 * @return {string} Updated version data.
 */
function updateVersion(data, major, minor, revision)
{
	const subversions = data.version.split('.');
	subversions[0] = (Number.parseInt(subversions[0]) + major).toString();
	subversions[1] = (Number.parseInt(subversions[1]) + minor).toString();
	subversions[2] = (Number.parseInt(subversions[2]) + revision).toString();

	data.version = subversions.join('.');

	return data;
}

/**
 * Minify and optimize using the closure compiler. The compiler is fetched from the node_modules folder these need to be installed first.
 */
function closure(level, formatting, languageIn, languageOut, fileIn, fileOut)
{
	const command = "java -jar " + CLOSURE_PATH + " --compilation_level " + level + " --warning_level QUIET --formatting " + formatting + " --language_in " + languageIn + " --language_out " + languageOut + " --js " + fileIn + " --js_output_file " + fileOut;

	require("child_process").execSync(command, function(error, stdout, stderr)
	{
		if(stdout !== "")
		{
			console.log("Error compiling with google closure, check if java is installed and try again.");
		}
	});
}

function formatNumber(number)
{
	return ("0" + number).slice(-2);
}

function addTimestamp(keyword, code)
{
	const date = new Date();
	const timestamp = date.getFullYear() + formatNumber(date.getMonth() + 1) + formatNumber(date.getDate()) + formatNumber(date.getHours()) + formatNumber(date.getMinutes());

	return code.replace(keyword, timestamp);
}

function compressCSS(code)
{
	code = code.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '');
	code = code.replace(/ {2,}/g, ' ');
	code = code.replace(/ ([{:}]) /g, '$1');
	code = code.replace(/([;,]) /g, '$1');
	code = code.replace(/ !/g, '!');

	return code;
}

function removeJSComments(code)
{
	return code.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, "");
}

function removeLogs(code)
{
	return code.replace(/console\.(error|log|warn|info)(.*)\;/gi, "");
}

function join(path, main)
{
	const code = readFile(main);
	const includes = getIncludes(code);
	let js = "", css = "";

	for(let i = 0; i < includes.length; i++)
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
			const directory = includes[i].replace("*", "");
			const files = fs.readdirSync(path + directory);

			for(let j = 0; j < files.length; j++)
			{
				includes.push(directory + files[j]);
			}
		}
	}

	js = code.replace(/"use strict";/gi, "").replace(/include\(".+?"\);/gi, "").replace(/^\s*\n/gm, "") + js;

	return {js: js, css: css};
}

function getIncludes(code, regex)
{
	if(regex === undefined)
	{
		regex = /include\([\"\'].+?[\"\']\);/g;
	}

	const results = [];
	let match = regex.exec(code);
	while(match !== null)
	{
		let files = /\(\s*([^)]+?)\s*\)/.exec(match[0]);
		if(files[1])
		{
			files = files[1].split(/\s*,\s*/);
		}

		for(let i = 0; i < files.length; i++)
		{
			results.push(files[i].replace(/[\"\']/gi, ""));
		}

		match = regex.exec(code);
	}

	return results;
}

/**
 * Read file from path as text.
 *
 * @param fname Path of the file.
 * @returns {string} Content of the file.
 */
function readFile(fname)
{
	return fs.readFileSync(fname, "utf8");
}

/**
 * Write text file into the path, automatically creates the directories.
 *
 * @param fname Path to write the file.
 * @param text File content
 */
function writeFile(fname, text)
{
	function checkDirectory(pathName)
	{
		const dirname = path.dirname(pathName);
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

function copyFolder(src, dst)
{
	makeDirectory(dst);
	const files = fs.readdirSync(src);

	for(let i = 0; i < files.length; i++)
	{
		const source = src + "/" + files[i];
		const destiny = dst + "/" + files[i];
		const current = fs.statSync(source);

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

function copyFile(src, dst)
{
	fs.copyFileSync(src, dst);
}

function renameFile(oldPath, newPath)
{
	fs.renameSync(oldPath, newPath);
}

function makeDirectory(dir)
{
	if(!fs.existsSync(dir))
	{
		fs.mkdirSync(dir);
	}
}

function deleteFolder(path)
{
	if(fs.existsSync(path))
	{
		fs.readdirSync(path).forEach(function(file, index)
		{
			const curPath = path + "/" + file;

			if(fs.lstatSync(curPath).isDirectory())
			{
				deleteFolder(curPath);
			}
			else
			{
				fs.unlinkSync(curPath);
			}
		});

		fs.rmdirSync(path);
	}
}

function deleteFile(fname)
{
	fs.unlinkSync(fname);
}

function downloadFolder(basePath, baseURL, ignoreRootFiles)
{
	const files = listFiles(basePath + "/", ignoreRootFiles, "");
	for(let i = 0; i < files.length; i++)
	{
		download(basePath + files[i], baseURL + files[i]);
	}
}

function listFiles(path, ignoreRootFiles, virtualPath)
{
	let files = [];

	fs.readdirSync(path).forEach(function(file, index)
	{
		const currentPath = path + "/" + file;
		const currentVirtualPath = virtualPath + "/" + file;

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

function download(fname, url)
{
	const http = require("https");
	let data = "";

	const request = http.get(url, function (response) {
		response.on("data", function (chunk) {
			data += chunk;
		});

		response.on("end", function (event)
		{
			if(data.search("404: Not Found") === -1)
			{
				writeFile(fname, data);
				console.log("Updated: " + fname);
			}
			else
			{
				console.log("Failed: " + fname);
			}

		});
	}).on("error", function (error)
	{
		console.log("Error: " + fname + ", " + error);
	});

	request.end();
}

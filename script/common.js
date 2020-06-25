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
	getFileName: getFileName,
	getFileNameNoExt: getFileNameNoExt,
	download: download,
	calculateRelativePath: calculateRelativePath,
	testCalculateRelativePath: testCalculateRelativePath
};

/**
 * Path to the closure compiler in node modules.
 *
 * @type {string}
 */
const CLOSURE_PATH = "../node_modules/google-closure-compiler-java/compiler.jar";

function testCalculateRelativePath()
{
	var tests = [
		["/c/d/e", "/f/h", "../../f/h"],
		["/a/b/c/d/e", "/a/b/f/h", "../../f/h"],
		["/a/b/c", "a/b/c/d", "./d"],
		["/c", "/c/d", "./d"]
	];

	for(var i = 0; i < tests.length; i++)
	{
		var a = calculateRelativePath(tests[i][0], tests[i][1]);
		console.log(a ===  tests[i][2], a);
	}
}

/**
 * Compare two paths and calcule the relative path from a to be from their absolute paths.
 *
 * e.g if a is /a/b/c/d/e and b is /a/b/f/h the calculated path will be ../../../f/h
 * 
 * @param {string} a Absolute path to the file/dir a
 * @param {string} b Absolute path to the file/dir b
 * @return {string} Absolute path from a to b.
 */
function calculateRelativePath(a, b)
{
	a = a.split("/");
	b = b.split("/");

	while(a.length > 0 && a[0].length === 0)
	{
		a.shift();
	}

	while(b.length > 0 && b[0].length === 0)
	{
		b.shift();
	}

	// Remove the portions of the path that are equal
	while(a.length > 0 && b.length > 0)
	{
		if(a[0] === b[0])
		{
			a.shift();
			b.shift();
		}
		else
		{
			break;
		}
	}

	var c = [];

	// Check steps to take backwards
	while(a.length > 1)
	{
		a.shift();
		b.unshift("..")
	}

	var res = b.join("/");

	if(!res.startsWith(".."))
	{
		res = "./" + res;
	}

	return res;
}

/**
 * Update the version of the library by adding to the current version.
 *
 * @param {string} version The object with the current version of the application.
 * @param {number} major How many to add to the major version.
 * @param {number} minor How many to add to the minor version.
 * @param {number} revision How many to add to the revision version.
 * @return {string} Updated version data.
 */
function updateVersion(version, major, minor, revision)
{
	const subversions = version.split('.');
	subversions[0] = (Number.parseInt(subversions[0]) + major).toString();
	subversions[1] = (Number.parseInt(subversions[1]) + minor).toString();
	subversions[2] = (Number.parseInt(subversions[2]) + revision).toString();

	return subversions.join('.');
}

/**
 * Minify and optimize using the closure compiler. (Required java JDK to be installed)
 *
 * The compiler is fetched from the node_modules folder these need to be installed first.
 *
 * It is recommended to annotate javascript code passed trough the closure compiler (https://developers.google.com/closure/compiler/docs/js-for-compiler).
 * 
 * @param {string} level Level of optimization applied can be ADVANCED_OPTIMIZATIONS, SIMPLE_OPTIMIZATIONS or WHITESPACE_ONLY.
 * @param {string} formatting Formatting configuration (e.g. PRETTY_PRINT, SINGLE_QUOTES)
 * @param {string} languageIn Script language from input (e.g. ES5, ES6)
 * @param {string} languageOut Script language to output (e.g. ES5, ES6)
 * @param {string} fileIn Input file to be processed.
 * @param {string} fileOut Output file path automatically written by the compiler.
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

/**
 * Format a integer number to occupy at least n decimal places in a string.
 *
 * @param {number} number Input value.
 * @param {number} places Count of decimal places.
 * @param {string} The output number with decimal places added.
 */
function formatNumber(number, places)
{
	if(places === undefined)
	{
		places = 2;
	}

	let str = number.toString();
	while(str.length < places)
	{
		str = "0" + str;
	}
	return str;
}

/**
 * Insert a timestamp into a file (replace a bit of text for the timestamp).
 *
 * @param {string} keyword Keyword to be replaced by the timestamp.
 * @param {string} data Input text data to search the keyword and replace with the timestamp.
 * @returns {string} Returns the data with the timescale placed.
 */
function addTimestamp(keyword, data)
{
	const date = new Date();
	const timestamp = date.getFullYear() + formatNumber(date.getMonth() + 1) + formatNumber(date.getDate()) + formatNumber(date.getHours()) + formatNumber(date.getMinutes());

	return data.replace(keyword, timestamp);
}

/**
 * Compress/simplify CSS styles code using regex transforms.
 *
 * Removes comments spaces etc.
 *
 * @param {string} code Content of the CSS file.
 * @return {string} The processed/simplified CSS code. 
 */
function compressCSS(code)
{
	code = code.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '');
	code = code.replace(/ {2,}/g, ' ');
	code = code.replace(/ ([{:}]) /g, '$1');
	code = code.replace(/([;,]) /g, '$1');
	code = code.replace(/ !/g, '!');

	return code;
}

/**
 * Remove comments from javascript code using regex.
 *
 * @param {string} code Input javascript code.
 * @return {string} The processed javascript code. 
 */
function removeJSComments(code)
{
	return code.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, "");
}

/**
 * Remove console logs from javascript code using regex.
 *
 * @param {string} code Input javascript code.
 * @return {string} The processed javascript code. 
 */
function removeLogs(code)
{
	return code.replace(/console\.(error|log|warn|info)(.*)\;/gi, "");
}

/**
 * Join multiple source files from a source code path. Parses and loads the file recursive looking for include() calls.
 *
 * The files are joined in the same order as they are declared its does not parse any kind of JS, CSS, etc parsing.
 *
 * @param {string} path Path to the source code folder.
 * @param {string} main Name of the main JS file.
 * @return {Object} Object containing the final js and css code.
 */
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

/**
 * Get includes from a javascript source code file, seraches for the include() method call.
 *
 * @param {string} code Javascript code to extract includes from.
 * @param {Regex} regex Alternative regex to search for includes in the file.
 * @return {string[]} List of includes found in the code.
 */
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
 * @param {string} fname Path of the file.
 * @returns {string} Content of the file.
 */
function readFile(fname)
{
	return fs.readFileSync(fname, "utf8");
}

/**
 * Write text file into the path, automatically creates the directories.
 *
 * @param {string} fname Path to write the file.
 * @param {string} text File content
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

/**
 * Copy a folder from a path to another path. Copies all files, folders and symlinks (shortcuts).
 *
 * @param {string} src Source folder path.
 * @param {string} dst Destination folder path.
 */
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

/**
 * Delete a folder from the system.
 * 
 * @param {string} path Path to delete.
 */
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

/**
 * Delete a file.
 *
 * @param {string} fname Path to the file.
 */
function deleteFile(fname)
{
	fs.unlinkSync(fname);
}

/**
 * Download a folder from the internet (from URL), into a local path.
 */
function downloadFolder(basePath, baseURL, ignoreRootFiles)
{
	const files = listFiles(basePath + "/", ignoreRootFiles, "");
	for(let i = 0; i < files.length; i++)
	{
		download(basePath + files[i], baseURL + files[i]);
	}
}

/**
 * List all files in a path (recursively), returns a list with the path of all files found.
 *
 * @param {string} path Path to list files.
 * @param {boolean} ignoreRootFiles Ignore the files in the root.
 * @param {string} virtualPath Virtual path inside of the main path.
 */
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

/**
 * Get file name with extension from file path string.
 * 
 * If input is a/b/c/abc.d output is abc.d.
 * 
 * @param {string} file File path
 * @return {string} File name without path with extension
 */
function getFileName(file)
{
	if(file !== undefined)
	{
		var a = file.lastIndexOf("\\");
		var b = file.lastIndexOf("/");

		return file.substring((a > b) ? (a + 1) : (b + 1), file.length);
	}
	
	return "";
}

/**
 * Get file name without extension from file path string.
 * 
 * If input is a/b/c/abc.d output is abc.
 * 
 * @param {string} file File path
 * @return {string} File name without path and extension
 */
function getFileNameNoExt(file)
{
	if(file !== undefined)
	{
		var a = file.lastIndexOf("\\");
		var b = file.lastIndexOf("/");

		return file.substring((a > b) ? (a + 1) : (b + 1), file.lastIndexOf("."));
	}
	
	return "";
}

/**
 * Download a file from the internet and store into a directory.
 *
 * @param {string} fname File name to store the file.
 * @param {string} url URL to download the file from.
 */
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

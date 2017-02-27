"use strict";

/**
 * FileSystem is used to read and write files using nunuStudio.
 * 
 * Some operations are platform specific and might not work everywhere.
 *
 * @module Files
 * @class FileSystem
 * @static
 */
function FileSystem(){}

try
{
	FileSystem.fs = require("fs");
}
catch(e){}

/**
 * Read file content as text.
 *
 * @method readFile
 * @param {String} fname URL to the file.
 * @param {boolean} sync If true the file will be read in sync.
 * @param {Function} onLoad onLoad callback.
 * @param {Function} onProgress onProgress callback.
 * @return {String} File content as a string, null if reading async.
 */
FileSystem.readFile = function(fname, sync, onLoad, onProgress)
{
	//Sync default to true
	if(sync === undefined)
	{
		sync = true;
	}

	//NodeJS
	if(FileSystem.fs !== undefined)
	{
		//Sync
		if(sync)
		{
			var data = FileSystem.fs.readFileSync(fname, "utf8");

			if(onLoad !== undefined)
			{
				onLoad(data);
			}
			
			return data;
		}
		//Async
		else
		{
			FileSystem.fs.readFile(fname, "utf8", function(err, data)
			{
				if(onLoad !== undefined)
				{
					onLoad(data);
				}
			});

			return null;
		}
	}
	//Browser
	else
	{
		var file = new XMLHttpRequest();
		file.overrideMimeType("text/plain");
		file.open("GET", fname, !sync);
		file.onload = function()
		{
			if(file.status === 200 || file.status === 0)
			{
				if(onLoad !== undefined)
				{
					onLoad(file.responseText);
				}
			}
		};
		
		if(onProgress !== undefined)
		{
			file.onprogress = function(event)
			{
				onProgress(event);
			};
		}

		file.send(null);

		return file.responseText;
	}
}

/**
 * Read file as arraybuffer data.
 *
 * @method readFileArrayBuffer
 * @param {String} fname Name of the file
 * @return {ArrayBuffer} File data as array buffer, null on error
 */
FileSystem.readFileArrayBuffer = function(fname)
{
	if(FileSystem.fs !== undefined)
	{
		var buffer = FileSystem.fs.readFileSync(fname);
		var length = buffer.length;
		var array = new ArrayBuffer(length);
		var view = new Uint8Array(array);

		for(var i = 0; i < length; i++)
		{
			view[i] = buffer[i];
		}

		return array;
	}
	else
	{
		var file = new XMLHttpRequest();
		file.open("GET", fname, false);
		file.overrideMimeType("text/plain; charset=x-user-defined");
		file.send(null);

		return ArraybufferUtils.fromBinaryString(file.response);
	}
}

/**
 * Read file as base64 data.
 *
 * @method readFileBase64
 * @param {String} fname Name of the file
 * @return {String} File data in base64, null on error
 */
FileSystem.readFileBase64 = function(fname)
{
	if(FileSystem.fs !== undefined)
	{
		var buffer = FileSystem.fs.readFileSync(fname);
		return new Buffer(buffer).toString("base64");
	}
	else
	{
		var file = new XMLHttpRequest();
		file.open("GET", fname, false);
		file.overrideMimeType("text/plain; charset=x-user-defined");
		file.send(null);

		return Base64Utils.fromBinaryString(file.response);
	}
}

/**
 * Write text file.
 * 
 * When running without NWJS it writes file as a blob and auto downloads it.
 *
 * @method writeFile
 * @param {String} fname File name.
 * @param {String} data Text to be written to the file.
 */
FileSystem.writeFile = function(fname, data)
{
	if(FileSystem.fs !== undefined)
	{
		var stream = FileSystem.fs.createWriteStream(fname, "utf8");
		stream.write(data);
		stream.end();
	}
	else
	{
		var blob = new Blob([data], {type:"octet/stream"});

		var download = document.createElement("a");
		download.download = fname;
		download.href = window.URL.createObjectURL(blob);
		download.onclick = function()
		{
			document.body.removeChild(this);
		};
		download.style.display = "none";
		document.body.appendChild(download);

		download.click();
	}
}

/**
 * Write binary file using base64 data.
 * 
 * Only works when running inside NWJS.
 *
 * @method writeFileBase64
 * @param {String} fname
 * @param {String} data
 */
FileSystem.writeFileBase64 = function(fname, data)
{
	if(FileSystem.fs !== undefined)
	{
		var buffer = Buffer.from(Base64Utils.removeHeader(data), "base64");

		var stream = FileSystem.fs.createWriteStream(fname);
		stream.write(buffer);
		stream.end();
	}
}

/**
 * Copy file (cannot be used to copy folders).
 * 
 * Only works when running inside NWJS.
 *
 * @method copyFile
 * @param {String} src
 * @param {String} dst
 */
FileSystem.copyFile = function(src, dst)
{
	if(FileSystem.fs !== undefined)
	{
		FileSystem.fs.createReadStream(src).pipe(FileSystem.fs.createWriteStream(dst));
	}
}

/**
 * Make a directory (dont trow exeption if directory already exists).
 * 
 * Only works when running inside NWJS.
 *
 * @method makeDirectory
 * @param {String} dir
 */
FileSystem.makeDirectory = function(dir)
{
	if(FileSystem.fs !== undefined)
	{
		try
		{
			FileSystem.fs.mkdirSync(dir);
		}
		catch(e){}
	}
}

/**
 * Returns files in directory (returns empty array in case of error).
 * 
 * Only works when running inside NWJS.
 *
 * @method getFilesDirectory
 * @return {Array} Files in the directory
 */
FileSystem.getFilesDirectory = function(dir)
{
	if(FileSystem.fs !== undefined)
	{
		try
		{
			return FileSystem.fs.readdirSync(dir);
		}
		catch(e)
		{
			return [];
		}
	}
	return [];
}

/**
 * Copy folder and all its files (includes symbolic links).
 * 
 * Only works when running inside NWJS.
 *
 * @method copyFolder
 * @param {String} src
 * @param {String} dest
 */
FileSystem.copyFolder = function(src, dest)
{
	if(FileSystem.fs !== undefined)
	{
		FileSystem.makeDirectory(dest);
		var files = FileSystem.fs.readdirSync(src);

		for(var i = 0; i < files.length; i++)
		{
			var source = src + "\\" + files[i];
			var destiny = dest + "\\" + files[i];
			var current = FileSystem.fs.statSync(source);
			
			//Directory
			if(current.isDirectory())
			{
				FileSystem.copyFolder(source, destiny);
			}
			//Symbolic link
			else if(current.isSymbolicLink())
			{
				FileSystem.fs.symlinkSync(FileSystem.fs.readlinkSync(source), destiny);
			}
			//File
			else
			{
				FileSystem.copyFile(source, destiny);
			}
		}
	}
}

/**
 * Open file chooser dialog receives onLoad callback, file filter, saveas.
 *
 * Save mode does not work inside the browser.
 *
 * @method chooseFile
 * @param {Function} onLoad onLoad callback
 * @param {String} filter File type filter
 * @param {String} saveas Save as format can be also a boolean value
 */
FileSystem.chooseFile = function(onLoad, filter, saveas)
{
	var chooser = document.createElement("input");
	chooser.type = "file";

	if(filter !== undefined)
	{
		chooser.accept = filter;
	}

	chooser.onchange = function(event)
	{	
		if(onLoad !== undefined)
		{
			onLoad(chooser.files);
		}
	};

	if(saveas !== undefined)
	{
		chooser.nwsaveas = (saveas !== true) ? saveas : "file";
	}
	
	chooser.click();
}

/**
 * Used as an alternative to chooseFile for saving files in the browser.
 *
 * Uses a prompt to question the user the file name.
 * 
 * @method chooseFileName
 * @param {Function} onLoad onLoad callback
 * @param {String} saveas File extension
 */
FileSystem.chooseFileName = function(onLoad, saveas)
{
	var fname = prompt("Save As", "file");
	
	if(fname !== null)
	{
		if(saveas !== undefined && !fname.endsWith(saveas))
		{
			fname += saveas;
		}
		
		if(onLoad !== undefined)
		{
			onLoad(fname);
		}
	}
}

/**
 * Check if a file exists.
 * 
 * Only works inside of NWJS. When running inside the browser always returns false.
 *
 * @method fileExists
 * @param {String} file File path
 * @return {boolean} True is file exists
 */
FileSystem.fileExists = function(file)
{
	if(FileSystem.fs !== undefined)
	{
		return FileSystem.fs.existsSync(file);
	}

	return false;
}

/**
 * Get file name without extension from file path string.
 * 
 * If input is a/b/c/abc.d output is abc.
 * 
 * @method getFileName
 * @param {String} file File path
 * @returns {String} File name without path and extension
 */
FileSystem.getFileName = function(file)
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
 * Get file name without extension.
 * 
 * If input is a/b/c/abc.d output is a/b/c/abc.
 *
 * @method getNameWithoutExtension
 * @param {String} file File path
 * @returns {String}
 */
FileSystem.getNameWithoutExtension = function(file)
{
	if(file !== undefined)
	{
		return file.substring(0, file.lastIndexOf("."));
	}

	return "";
}

/**
 * Get file directoty.
 * 
 * If input is a/b/c/abc.d output is a/b/c/
 *
 * @method getFilePath
 * @param {String} file File path
 * @return {String}
 */
FileSystem.getFilePath = function(file)
{
	if(file !== undefined)
	{
		var a = file.lastIndexOf("\\");
		var b = file.lastIndexOf("/");

		return file.substring(0, (a > b) ? (a + 1) : (b + 1));
	}

	return "";
}

/**
 * Get file extension from file path string (always in lowercase).
 * 
 * If input is a/b/c/abc.d output is d.
 *
 * @method getFileExtension
 * @param {String} file File path
 * @return {String}
 */
FileSystem.getFileExtension = function(file)
{
	if(file !== undefined)
	{
		return file.substring(file.lastIndexOf(".") + 1, file.length).toLowerCase();
	}
	
	return "";
}

"use strict";

/**
 * FileSystem is used to read and write files using nunuStudio.
 * 
 * Its implements muitple solutions for each method depending on the platform (NodeJS, brower or cordova).
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
 * Check if a file corresponds to a remote location.
 *
 * @method isRemote
 * @return {Boolean} If the file is remote returns true, false otherwise.
 */
FileSystem.isRemote = function(fname)
{
	return fname.startsWith("http") || (FileSystem.fs !== undefined && FileSystem.fs.existsSync(file));
};

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
	if(FileSystem.fs !== undefined && FileSystem.fs.existsSync(file))
	{
		if(sync)
		{
			var data = FileSystem.fs.readFileSync(fname, "utf8");

			if(onLoad !== undefined)
			{
				onLoad(data);
			}
			
			return data;
		}
		else
		{
			FileSystem.fs.readFile(fname, "utf8", function(error, data)
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
			if((file.status === 200 || file.status === 0) && onLoad !== undefined)
			{
				onLoad(file.response);
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

		return file.response;
	}
};

/**
 * Read file as arraybuffer data.
 *
 * @method readFileArrayBuffer
 * @param {String} fname Name of the file
 * @param {boolean} sync If true the file will be read in sync.
 * @param {Function} onLoad onLoad callback.
 * @param {Function} onProgress onProgress callback.
 * @return {ArrayBuffer} File data as array buffer, null on error
 */
FileSystem.readFileArrayBuffer = function(fname, sync, onLoad, onProgress)
{
	if(sync === undefined)
	{
		sync = true;
	}

	//NodeJS
	if(FileSystem.fs !== undefined && FileSystem.fs.existsSync(file))
	{
		if(sync)
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
			FileSystem.fs.readFile(fname, function(error, buffer)
			{
				if(onLoad !== undefined)
				{
					var length = buffer.length;
					var array = new ArrayBuffer(length);
					var view = new Uint8Array(array);

					for(var i = 0; i < length; i++)
					{
						view[i] = buffer[i];
					}

					onLoad(array);
				}
			});

			return null;
		}
	}
	//Browser
	else
	{
		var file = new XMLHttpRequest();
		file.open("GET", fname, !sync);
		file.overrideMimeType("text/plain; charset=x-user-defined");

		file.onload = function()
		{
			if((file.status === 200 || file.status === 0) && onLoad !== undefined)
			{
				onLoad(ArraybufferUtils.fromBinaryString(file.response));
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

		return ArraybufferUtils.fromBinaryString(file.response);
	}
};

/**
 * Read file as base64 data.
 *
 * @method readFileBase64
 * @param {String} fname Name of the file
 * @param {boolean} sync If true the file will be read in sync.
 * @param {Function} onLoad onLoad callback.
 * @param {Function} onProgress onProgress callback.
 * @return {String} File data in base64, null on error
 */
FileSystem.readFileBase64 = function(fname, sync, onLoad, onProgress)
{
	if(sync === undefined)
	{
		sync = true;
	}
	
	//NodeJS
	if(FileSystem.fs !== undefined && FileSystem.fs.existsSync(file))
	{
		if(sync)
		{
			var buffer = FileSystem.fs.readFileSync(fname);
			return new Buffer(buffer).toString("base64");
		}
		else
		{
			FileSystem.fs.readFile(fname, function(error, buffer)
			{
				if(onLoad !== undefined)
				{
					onLoad(new Buffer(buffer).toString("base64"));
				}
			});

			return null;
		}
	}
	//Browser
	else
	{
		var file = new XMLHttpRequest();
		file.open("GET", fname, !sync);
		file.overrideMimeType("text/plain; charset=x-user-defined");
		
		file.onload = function()
		{
			if((file.status === 200 || file.status === 0) && onLoad !== undefined)
			{
				onLoad(Base64Utils.fromBinaryString(file.response));
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

		return Base64Utils.fromBinaryString(file.response);
	}
};

/**
 * Write text file.
 * 
 * When running without NWJS it writes file as a blob and auto downloads it.
 *
 * @method writeFile
 * @param {String} fname Name/path of the file to write.
 * @param {String} data Text to be written to the file.
 * @param {Boolean} sync If true the file is written syncronously. (Only available for Nodejs).
 * @param {Function} onFinish Callback function called when the file is written.
 */
FileSystem.writeFile = function(fname, data, sync, onFinish)
{
	if(FileSystem.fs !== undefined)
	{
		if(FileSystem.fs.writeFileSync !== undefined)
		{
			if(sync !== false)
			{
				FileSystem.fs.writeFileSync(fname, data, "utf8");
				if(onFinish !== undefined)
				{
					onFinish();
				}
			}
			else
			{
				FileSystem.fs.writeFile(fname, data, "utf8", onFinish);
			}
		}
		else
		{
			var stream = FileSystem.fs.createWriteStream(fname, "utf8");
			stream.write(data);
			stream.end();
		}
	}
	else
	{
		var blob = new Blob([data], {type:"octet/stream"});

		var download = document.createElement("a");
		download.download = fname;
		download.href = window.URL.createObjectURL(blob);
		download.style.display = "none";
		download.onclick = function()
		{
			document.body.removeChild(this);
		};
		document.body.appendChild(download);
		download.click();

		if(onFinish !== undefined)
		{
			onFinish();
		}
	}
};

/**
 * Write binary file using base64 data.
 *
 * If running on browser writes the file into a blob and auto downloads it.
 *
 * @method writeFileBase64
 * @param {String} fname Name/path of the file to write.
 * @param {String} data Base64 data to be written into the file.
 * @param {Boolean} sync If true the file is written syncronously. (Only available for Nodejs)
 * @param {Function} onFinish Callback function called when the file is written.
 */
FileSystem.writeFileBase64 = function(fname, data, sync, onFinish)
{
	if(FileSystem.fs !== undefined)
	{
		var buffer = Buffer.from(Base64Utils.removeHeader(data), "base64");

		if(FileSystem.fs.writeFile !== undefined)
		{
			if(sync !== false)
			{
				FileSystem.fs.writeFileSync(fname, buffer);

				if(onFinish !== undefined)
				{
					onFinish();
				}
			}
			else
			{
				FileSystem.fs.writeFile(fname, buffer, onFinish);
			}
		}
		else
		{
			var stream = FileSystem.fs.createWriteStream(fname);
			stream.write(buffer);
			stream.end();
		}
	}
	else
	{
		var array = ArraybufferUtils.fromBase64(Base64Utils.removeHeader(data));
		var blob = new Blob([array]);

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

		if(onFinish !== undefined)
		{
			onFinish();
		}
	}
};

/**
 * Write binary file using arraybuffer data. 
 *
 * If running on browser writes the file into a blob and auto downloads it.
 *
 * @method writeFileArrayBuffer
 * @param {String} fname Name/path of the file to write.
 * @param {String} data Arraybuffer data to be written into the file.
 * @param {Boolean} sync If true the file is written syncronously. (Only available for Nodejs)
 * @param {Function} onFinish Callback function called when the file is written.
 */
FileSystem.writeFileArrayBuffer = function(fname, data, sync, onFinish)
{	
	if(FileSystem.fs !== undefined)
	{
		var buffer = BufferUtils.fromArrayBuffer(data);

		if(FileSystem.fs.writeFileSync !== undefined)
		{
			if(sync !== false)
			{
				FileSystem.fs.writeFileSync(fname, buffer);

				if(onFinish !== undefined)
				{
					onFinish();
				}
			}
			else
			{
				FileSystem.fs.writeFile(fname, buffer, onFinish);
			}
		}
		else
		{
			var stream = FileSystem.fs.createWriteStream(fname);
			stream.write(buffer);
			stream.end();
		}
	}
	else
	{
		var blob = new Blob([data]);

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
		
		if(onFinish !== undefined)
		{
			onFinish();
		}
	}
};

/**
 * Open file chooser dialog receives onLoad callback, file filter, saveas.
 *
 * Save mode does not work inside the browser.
 *
 * The onLoad callback receives as array of files as parameter.
 *
 * @method chooseFile
 * @param {Function} onLoad onLoad callback that receives array of files choosen as parameter
 * @param {String} filter File type filter
 * @param {String} saveas Save as format can be also a boolean value
 */
FileSystem.chooseFile = function(onLoad, filter, saveas)
{
	var chooser = document.createElement("input");
	chooser.type = "file";
	chooser.style.display = "none";
	document.body.appendChild(chooser);

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

		document.body.removeChild(chooser);
	};

	if(saveas !== undefined)
	{
		chooser.nwsaveas = (saveas !== true) ? saveas : "file";
	}
	
	chooser.click();
};

/**
 * Used as an alternative to chooseFile for saving files in the browser.
 *
 * Uses a prompt to question the user the file name.
 * 
 * @method chooseFileName
 * @param {Function} onLoad onLoad callback
 * @param {String} saveas File extension
 */
FileSystem.chooseFileName = function(onLoad, saveas, name)
{
	var fname = prompt("Save As", name !== undefined ? name : "file");
	
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
};

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
		if(FileSystem.fs.copyFileSync !== undefined)
		{
			FileSystem.fs.copyFileSync(src, dst);
		}
		else
		{
			src.replace(new RegExp("/", 'g'), "\\");
			dst.replace(new RegExp("/", 'g'), "\\");

			FileSystem.fs.createReadStream(src).pipe(FileSystem.fs.createWriteStream(dst));
		}
	}
};

/**
 * Make a directory (dont throw exeption if directory already exists).
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
		dir.replace(new RegExp("/", 'g'), "\\");
		FileSystem.fs.mkdirSync(dir);
	}
};

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
			dir.replace(new RegExp("/", 'g'), "\\");
			return FileSystem.fs.readdirSync(dir);
		}
		catch(e)
		{
			return [];
		}
	}

	return [];
};

/**
 * Delete folders and all subfolders.
 * 
 * Only works when running inside NWJS.
 *
 * @method deleteFolder
 * @param {String} path
 */
FileSystem.deleteFolder = function(path)
{
	if(FileSystem.fs !== undefined)
	{
		if(FileSystem.fs.existsSync(path))
		{
			FileSystem.fs.readdirSync(path).forEach(function(file, index)
			{
				var curPath = path + "/" + file;

				if(FileSystem.fs.lstatSync(curPath).isDirectory())
				{
					FileSystem.deleteFolder(curPath);
				}
				else
				{
					FileSystem.fs.unlinkSync(curPath);
				}
			});

			FileSystem.fs.rmdirSync(path);
		}
	}
};

/**
 * Copy folder and all its files (includes symbolic links).
 * 
 * Only works when running inside NWJS.
 *
 * @method copyFolder
 * @param {String} src
 * @param {String} dst
 */
FileSystem.copyFolder = function(src, dst)
{
	if(FileSystem.fs !== undefined)
	{
		src.replace(new RegExp("/", 'g'), "\\");
		dst.replace(new RegExp("/", 'g'), "\\");

		FileSystem.makeDirectory(dst);
		var files = FileSystem.fs.readdirSync(src);

		for(var i = 0; i < files.length; i++)
		{
			var source = src + "\\" + files[i];
			var destiny = dst + "\\" + files[i];
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
};

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
		file.replace(new RegExp("/", 'g'), "\\");

		return FileSystem.fs.existsSync(file);
	}

	return false;
};

/**
 * Get file name without extension from file path string.
 * 
 * If input is a/b/c/abc.d output is abc.
 * 
 * @method getFileName
 * @param {String} file File path
 * @return {String} File name without path and extension
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
};

/**
 * Get file name with extension from file path string.
 * 
 * If input is a/b/c/abc.d output is abc.d.
 * 
 * @method getFileNameWithExtension
 * @param {String} file File path
 * @return {String} File name without path with extension
 */
FileSystem.getFileNameWithExtension = function(file)
{
	if(file !== undefined)
	{
		var a = file.lastIndexOf("\\");
		var b = file.lastIndexOf("/");

		return file.substring((a > b) ? (a + 1) : (b + 1), file.length);
	}
	
	return "";
};

/**
 * Get file name without extension.
 * 
 * If input is a/b/c/abc.d output is a/b/c/abc.
 *
 * @method getNameWithoutExtension
 * @param {String} file File path
 * @return {String}
 */
FileSystem.getNameWithoutExtension = function(file)
{
	if(file !== undefined)
	{
		return file.substring(0, file.lastIndexOf("."));
	}

	return "";
};

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
};

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
};

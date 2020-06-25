import {BufferUtils} from "../utils/binary/BufferUtils.js";
import {Base64Utils} from "../utils/binary/Base64Utils.js";
import {ArraybufferUtils} from "../utils/binary/ArraybufferUtils.js";
import {Nunu} from "../Nunu.js";
import {Text} from "../../editor/components/Text.js";


/**
 * FileSystem is used to read and write files using nunuStudio.
 * 
 * Its implements multiple solutions for each method depending on the platform (NodeJS, brower or cordova).
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
 * @method isLocalFile
 * @return {boolean} If the file is remote returns true, false otherwise.
 */
FileSystem.isLocalFile = function(url)
{
	return !(url.startsWith("http") || url.startsWith("blob") || url.startsWith("data"));
};

/**
 * Read a local or remote file as text data.
 *
 * When running on desktop uses nodejs to access files, on the web performs a http GET request.
 * 
 * @method readFile
 * @param {string} fname Path or URL of the file being read.
 * @param {boolean} sync If true the file will be read in sync.
 * @param {Function} onLoad onLoad callback receives the read data as parameter.
 * @param {Function} onProgress onProgress callback used to check the file reading progress.
 * @param {Function} onError onError call is called when a error occurs while reading the file.
 * @return {string} File text, or null if the request is async.
 */
FileSystem.readFile = function(fname, sync, onLoad, onProgress, onError)
{
	if(sync === undefined)
	{
		sync = true;
	}

	// NodeJS
	if(FileSystem.fs !== undefined && FileSystem.isLocalFile(fname))
	{
		if(sync === true)
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
				if(error !== null)
				{
					if(onError !== undefined)
					{
						onError(error);
					}
				}
				else if(onLoad !== undefined)
				{
					onLoad(data);
				}
			});

			return null;
		}
	}
	// Browser
	else
	{
		var file = new XMLHttpRequest();
		file.overrideMimeType("text/plain");
		file.open("GET", fname, !sync);
		
		if(onLoad !== undefined)
		{
			file.onload = function()
			{
				onLoad(file.response);
			};
		}

		if(onProgress !== undefined)
		{
			file.onprogress = onProgress;
		}
		if(onError !== undefined)
		{
			file.onerror = onError;
		}

		file.send(null);

		return sync === true ? file.response : null;
	}
};

/**
 * Read a local or remote file as arraybuffer data.
 *
 * When running on desktop uses nodejs to access files, on the web performs a http GET request.
 * 
 * @method readFileArrayBuffer
 * @param {string} fname Path or URL of the file being read.
 * @param {boolean} sync If true the file will be read in sync.
 * @param {Function} onLoad onLoad callback receives the read data as parameter.
 * @param {Function} onProgress onProgress callback used to check the file reading progress.
 * @param {Function} onError onError call is called when a error occurs while reading the file.
 * @return {ArrayBuffer} File data as array buffer, or null if the request is async.
 */
FileSystem.readFileArrayBuffer = function(fname, sync, onLoad, onProgress, onError)
{
	if(sync === undefined)
	{
		sync = true;
	}

	// NodeJS
	if(FileSystem.fs !== undefined && FileSystem.isLocalFile(fname))
	{
		if(sync === true)
		{
			var buffer = FileSystem.fs.readFileSync(fname);
			return ArraybufferUtils.fromBuffer(buffer);
		}
		else
		{
			FileSystem.fs.readFile(fname, function(error, buffer)
			{
				if(error !== null)
				{
					if(onError !== undefined)
					{
						onError(error);
					}
				}
				else if(onLoad !== undefined)
				{
					onLoad(ArraybufferUtils.fromBuffer(buffer));
				}
			});

			return null;
		}
	}
	// Browser
	else
	{
		var file = new XMLHttpRequest();
		file.open("GET", fname, !sync);
		file.overrideMimeType("text/plain; charset=x-user-defined");

		if(onLoad !== undefined)
		{
			file.onload = function()
			{
				onLoad(ArraybufferUtils.fromBinaryString(file.response));
			};
		}

		if(onProgress !== undefined)
		{
			file.onprogress = onProgress;
		}
		if(onError !== undefined)
		{
			file.onerror = onError;
		}

		file.send(null);

		return sync === true ? ArraybufferUtils.fromBinaryString(file.response) : null;
	}
};

/**
 * Read a local or remote file as base64 data.
 *
 * When running on desktop uses nodejs to access files, on the web performs a http GET request.
 * 
 * @method readFileBase64
 * @param {string} fname Path or URL of the file being read.
 * @param {boolean} sync If true the file will be read in sync.
 * @param {Function} onLoad onLoad callback receives the read data as parameter.
 * @param {Function} onProgress onProgress callback used to check the file reading progress.
 * @param {Function} onError onError call is called when a error occurs while reading the file.
 * @return {string} File data as base64, or null if the request is async.
 */
FileSystem.readFileBase64 = function(fname, sync, onLoad, onProgress, onError)
{
	if(sync === undefined)
	{
		sync = true;
	}
	
	// NodeJS
	if(FileSystem.fs !== undefined && FileSystem.isLocalFile(fname))
	{
		if(sync === true)
		{
			var buffer = FileSystem.fs.readFileSync(fname);
			return new Buffer(buffer).toString("base64");
		}
		else
		{
			FileSystem.fs.readFile(fname, function(error, buffer)
			{
				if(error !== null)
				{
					if(onError !== undefined)
					{
						onError(error);
					}
				}
				else if(onLoad !== undefined)
				{
					onLoad(new Buffer(buffer).toString("base64"));
				}
			});

			return null;
		}
	}
	// Browser
	else
	{
		var file = new XMLHttpRequest();
		file.open("GET", fname, !sync);
		file.overrideMimeType("text/plain; charset=x-user-defined");
		
		if(onLoad !== undefined)
		{		
			file.onload = function()
			{
				onLoad(Base64Utils.fromBinaryString(file.response));
			};
		}
		if(onProgress !== undefined)
		{
			file.onprogress = onProgress;
		}
		if(onError !== undefined)
		{
			file.onerror = onError;
		}

		file.send(null);

		return sync === true ? Base64Utils.fromBinaryString(file.response) : null;
	}
};

/**
 * Write text to a file.
 * 
 * When running on the web it writes file to a blob and auto downloads it.
 *
 * @method writeFile
 * @param {string} fname Name/path of the file to write.
 * @param {string} data Text to be written to the file.
 * @param {boolean} sync If true the file is written syncronously. (Only available for Nodejs).
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
 * If running on the web writes the file into a blob and auto downloads it.
 *
 * @method writeFileBase64
 * @param {string} fname Name/path of the file to write.
 * @param {string} data Base64 data to be written into the file.
 * @param {boolean} sync If true the file is written syncronously. (Only available for Nodejs)
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
 * If running on the web writes the file into a blob and auto downloads it.
 *
 * @method writeFileArrayBuffer
 * @param {string} fname Name/path of the file to write.
 * @param {string} data Arraybuffer data to be written into the file.
 * @param {boolean} sync If true the file is written syncronously. (Only available for Nodejs)
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
 * Choose a file path/name to create a new file and write it to the system.
 *
 * Depending on the platform opens a file path selection windows of a box to select the name of the file.
 *
 * @method chooseFileWrite
 * @param {Function} onLoad onLoad callback that receives the path select to write the file.
 * @param {string} filter File type filter (e.g. ".zip,.rar, etc).
 */
FileSystem.chooseFileWrite = function(onLoad, filter)
{
	if(Nunu.runningOnDesktop())
	{
		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				onLoad(files[0].path);
			}
		}, filter, true);
	}
	else
	{
		FileSystem.chooseFileName(function(fname)
		{
			onLoad(fname);
		}, filter);
	}
};

/**
 * Open file chooser dialog window for the user to select files stored in the system.
 *
 * The files selected are retrieved using the onLoad callback that receives a array of File objects.
 *
 * @method chooseFile
 * @param {Function} onLoad onLoad callback that receives array of files as parameter.
 * @param {string} filter File type filter (e.g. ".zip,.rar, etc)
 * @param {string} saveas File format or name to be used, optinonally it can be a boolean value indicating savemode.
 * @param {boolean} multiFile If true the chooser will accept multiple files.
 */
FileSystem.chooseFile = function(onLoad, filter, saveas, multiFile)
{
	var chooser = document.createElement("input");
	chooser.type = "file";
	chooser.style.display = "none";
	document.body.appendChild(chooser);

	if(filter !== undefined)
	{
		chooser.accept = filter;
	}

	if(multiFile === true)
	{
		chooser.multiple = true;
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
 * @param {string} saveas File extension
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
 * @param {string} src
 * @param {string} dst
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
 * @param {string} dir
 */
FileSystem.makeDirectory = function(dir)
{
	if(FileSystem.fs !== undefined)
	{
		dir.replace(new RegExp("/", 'g'), "\\");
		FileSystem.fs.mkdirSync(dir, {recursive: true});
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
 * @param {string} path
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
 * @param {string} src
 * @param {string} dst
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
			
			// Directory
			if(current.isDirectory())
			{
				FileSystem.copyFolder(source, destiny);
			}
			// Symbolic link
			else if(current.isSymbolicLink())
			{
				FileSystem.fs.symlinkSync(FileSystem.fs.readlinkSync(source), destiny);
			}
			// File
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
 * @param {string} file File path
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
 * @param {string} file File path
 * @return {string} File name without path and extension
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
 * @param {string} file File path
 * @return {string} File name without path with extension
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
 * @param {string} file File path
 * @return {string}
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
 * Get directory where the file is placed.
 * 
 * If input is a/b/c/abc.d output is a/b/c/
 *
 * @method getFilePath
 * @param {string} file File path
 * @return {string}
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
 * @param {string} file File path
 * @return {string}
 */
FileSystem.getFileExtension = function(file)
{	
	if(file !== undefined)
	{
		return file.substring(file.lastIndexOf(".") + 1, file.length).toLowerCase();
	}
	
	return "";
};
export {FileSystem};
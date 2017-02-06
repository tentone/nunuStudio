"use strict";

function FileSystem(){}

try
{
	FileSystem.fs = require("fs");
}
catch(e)
{
}

//Read text file
FileSystem.readFile = function(file, callback)
{
	//Check if node available
	if(FileSystem.fs !== undefined)
	{
		FileSystem.fs.readFile(file, "utf8", callback);
	}
	else
	if(file instanceof Object)
	{
		var reader = new FileReader();
		reader.addEventListener( 'load', function ( event )
		{
			 if(callback)
			 {
				 callback(event);
			 }
		}, false);
		reader.readAsText(file);
		return reader.result;
	}
	else
	{
		var reader = new XMLHttpRequest();
		reader.open("GET", file);
		reader.overrideMimeType("text/plain; charset=x-user-defined");
		reader.onreadystatechange = function ()
		{
			if(reader.status == reader.DONE)
			{
				if(callback)
				{
					callback(reader.responseText);
				}
			}
		}
		reader.send(null);		
	}
}

//Read file as arraybuffer data
FileSystem.readFileArrayBuffer = function(fname, callback)
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
		if(callback){
			callback(view);
		}
	}
	else
	{
		var file = new XMLHttpRequest();
		file.open("GET", fname);
		file.responseType = "arraybuffer";
		file.overrideMimeType("text/plain; charset=x-user-defined");
		file.onreadystatechange = function ()
		{
			if(file.status == file.DONE)
			{
				if(callback)
				{
					callback(file.response);
				}
			}
		}
		file.send(null);
	}
}

//Read file as base64 data
FileSystem.readFileBase64 = function(fname, callback)
{
	if(FileSystem.fs !== undefined)
	{
		var buffer = FileSystem.fs.readFileSync(fname);
		if(callback){
			callback(new Buffer(buffer).toString("base64"));
		}
	}
	else
	{
		var file = new XMLHttpRequest();
		file.open("GET", fname);
		file.overrideMimeType("text/plain; charset=x-user-defined");
		file.onreadystatechange = function ()
		{
			if(file.status == file.DONE)
			{
				if(callback)
				{
					callback(Base64Utils.fromBinaryString(file.response));
				}
			}
		}
		file.send(null);
	}
}

//Write text file
FileSystem.writeFile = function(fn, data)
{
	var success = false;
	var fileExt = ".isp";
	if(fn){
		success = fn;
		var blob = new Blob([data],{type:"text/javascript"});
		var url = URL.createObjectURL(blob);
		var m_Link = document.createElement("a");
		m_Link.href = url;
		m_Link.download = fn + fileExt;
		document.body.appendChild(m_Link);
		m_Link.click();
	}
	return success;
}

//Write binary file from base64 data
FileSystem.writeFileBase64 = function(file, data)
{
	if(FileSystem.fs !== undefined)
	{
		var buffer = Buffer.from(Base64Utils.removeHeader(data), "base64");
		var stream = FileSystem.fs.createWriteStream(file);
		stream.write(buffer);
		stream.end();
	}
}

//Copy file (cant be used to copy folders)
FileSystem.copyFile = function(src, dest)
{
	if(FileSystem.fs !== undefined)
	{
		FileSystem.fs.createReadStream(src).pipe(FileSystem.fs.createWriteStream(dest));
	}
}

//Make a directory (dont trow exeption if directory already exists)
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

//Returns files in directory (returns empty array in case of error)
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

//Copy folder and all its files (includes symbolic links)
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

//Open file chooser dialog receives callback function, file filter, saveas
FileSystem.chooseFile = function(callback, filter, saveas)
{
	var chooser = document.createElement("input");
	chooser.type = "file";
	chooser.accept = (filter !== undefined) ? filter : "";

	if(saveas !== undefined)
	{
		if(saveas !== true)
		{
			chooser.nwsaveas = saveas;
		}
		else
		{
			chooser.nwsaveas = "file";
		}
	}

	chooser.onchange = function(event)
	{
		if(callback !== undefined)
		{
			callback(chooser.files);
		}
	};

	chooser.click();
}

FileSystem.fileExists = function(file)
{
	if(FileSystem.fs !== undefined)
	{
		return FileSystem.fs.existsSync(file);
	}

	return false;
}

//Get file name from file path string
FileSystem.getFileName = function(file)
{
	return file.substring(file.lastIndexOf("\\") + 1, file.lastIndexOf("."));
}

//Get file name without extension
FileSystem.getNameWithoutExtension = function(file)
{
	return file.substring(0, file.lastIndexOf("."));
}

//Get file directoty
FileSystem.getFilePath = function(file)
{
	return file.substring(0, file.lastIndexOf("\\") + 1);
}

//Get file extension from file path string
FileSystem.getFileExtension = function(file)
{
	return file.substring(file.lastIndexOf(".") + 1, file.length);
}

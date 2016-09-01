"use strict";

function FileSystem(){}

//Read text file
FileSystem.readFile = function(fname, sync, callback)
{
	if(sync === undefined)
	{
		sync = true;
	}

	//Check if node available
	if(App.fs !== undefined)
	{
		if(sync)
		{
			return App.fs.readFileSync(fname, "utf8");
		}
		else
		{
			App.fs.readFile(fname, "utf8", callback);
		}
	}
	else
	{
		var file = new XMLHttpRequest();
		file.overrideMimeType("text/plain");
		file.open("GET", fname, !sync);
		file.onreadystatechange = function ()
		{
			if(file.status === 200 || file.status === 0)
			{
				if(callback !== undefined)
				{
					callback(file.responseText);
				}
			}
		}
		file.send(null);
		return file.responseText;
	}
}

//Read file as arraybuffer data
FileSystem.readFileArrayBuffer = function(fname)
{
	if(App.fs !== undefined)
	{
		var buffer = App.fs.readFileSync(fname);
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

//Read file as base64 data
FileSystem.readFileBase64 = function(fname)
{
	if(App.fs !== undefined)
	{
		var buffer = fs.readFileSync(fname);
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

//Write text file
FileSystem.writeFile = function(fname, data)
{
	if(App.fs !== undefined)
	{
		var stream = App.fs.createWriteStream(fname, "utf8");
		stream.write(data);
		stream.end();
	}
}

//Copy file (cant be used to copy folders)
FileSystem.copyFile = function(src, dest)
{
	if(App.fs !== undefined)
	{
		App.fs.createReadStream(src).pipe(App.fs.createWriteStream(dest));
	}
}

//Make a directory (dont trow exeption if directory already exists)
FileSystem.makeDirectory = function(dir)
{
	if(App.fs !== undefined)
	{
		try
		{
			App.fs.mkdirSync(dir);
		}
		catch(e){}
	}
}

//Returns files in directory (returns empty array in case of error)
FileSystem.getFilesDirectory = function(dir)
{
	if(App.fs !== undefined)
	{
		try
		{
			return App.fs.readdirSync(dir);
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
	if(App.fs !== undefined)
	{
		FileSystem.makeDirectory(dest);
		var files = App.fs.readdirSync(src);

		for(var i = 0; i < files.length; i++)
		{
			var source = src + "\\" + files[i];
			var destiny = dest + "\\" + files[i];
			var current = App.fs.statSync(source);
			
			//Directory
			if(current.isDirectory())
			{
				FileSystem.copyFolder(source, destiny);
			}
			//Symbolic link
			else if(current.isSymbolicLink())
			{
				App.fs.symlinkSync(App.fs.readlinkSync(source), destiny);
			}
			//File
			else
			{
				FileSystem.copyFile(source, destiny);
			}
			
		}
	}
}

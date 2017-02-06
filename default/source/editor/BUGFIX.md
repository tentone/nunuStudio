SYMP: Texture load fails

(Interface.js:300)

		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				var file = files[0].name;
				var name = FileSystem.getFileName(file);
				var texture = new Texture(new Image(file));
				texture.name = name;
				Editor.program.addTexture(texture);

				Editor.updateObjectViews();
			}
		}, "image/*");

SOLU:

(Interface.js:300)

		FileSystem.chooseFile(function(files)
		{
			if(files.length > 0)
			{
				var file = files[0];
				var name = FileSystem.getFileName(files[0].name);
				var reader = new FileReader();
				reader.addEventListener( 'load', 
				function ( event ) {
					var blob_uri = event.target.result;
					var texture = new Texture(new Image(blob_uri));
					texture.name = name;
					Editor.program.addTexture(texture);
					Editor.updateObjectViews();					
				}, false);					
				reader.readAsDataURL( file );
			}
		}, "image/*");    

SYMP: File > Save/SaveAs (fails)

(FileSystem.js:99) 
	
		FileSystem.writeFile = function(fname, data)
		{
			if(FileSystem.fs !== undefined)
			{
				var stream = FileSystem.fs.createWriteStream(fname, "utf8");
				stream.write(data);
				stream.end();
			}
		}
		
(Interface.js:1230)

		Interface.saveProgram = function()
		{
			FileSystem.chooseFile(function(files)
			{
				try
				{
					Editor.saveProgram(files[0].name);
					alert("Project saved");
				}
				catch(e)
				{
					alert("Error saving file\n(" + e + ")");
				}
			}, ".isp", true);
		}
	
(Editor.js:1242)

		FileSystem.writeFile(fname, json);
		.
		.
		return;

SOLU:

(FileSystem.js:99) 

		FileSystem.writeFile = function(fn, data)
		{
			var success = false;
			var fileExt = ".isp";
			fn || (fn = "default");
			fn = prompt("Project - Save As",fn);
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

(Interface.js:1230)
	
		Interface.saveProgram = function()
		{	
			try
			{
				if(Editor.saveProgram()){
					alert("Project saved");
				}
			}
			catch(e)
			{
				alert("Error saving file\n(" + e + ")");
			}
		}
	
(Editor.js:1242)

		var success = FileSystem.writeFile(fname, json);
		.
		.
		return success;	
"use strict";

function AssetExplorer(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;
	
	//ID
	var id = "assetExplorer" + AssetExplorer.id;
	AssetExplorer.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.style.overflow = "auto";
	this.element.style.cursor = "default";
	this.element.style.backgroundColor = Editor.theme.panelColor;

	//Drop event
	this.element.ondrop = function(event)
	{
		//Dragged file into object
		if(event.dataTransfer.files.length > 0)
		{
			var file = event.dataTransfer.files[0];
			var name = FileSystem.getFileName(file.path);

			//Image
			if(file.type.startsWith("image"))
			{
				var texture = new Texture(file.path);
				texture.name = name;
				Editor.program.addTexture(texture);
				Editor.updateAssetExplorer();
			}
			//Video
			else if(file.type.startsWith("video"))
			{
				var texture = new VideoTexture(file.path);
				texture.name = name;
				Editor.program.addTexture(texture);
				Editor.updateAssetExplorer();
			}
			//Audio
			else if(file.type.startsWith("audio"))
			{
				var audio = new Audio(file.path);
				audio.name = name;
				Editor.program.addAudio(audio);
				Editor.updateAssetExplorer();
			}
			//Font
			else if(FontLoader.fileIsFont(file.path))
			{
				var font = new Font(file.path);
				Editor.program.addFont(font);
				Editor.updateAssetExplorer();
			}
		}
	};

	this.element.ondragover = function(event)
	{
		event.preventDefault();
	};

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Files in explorer
	this.filesSize = new THREE.Vector2(70, 70);
	this.filesSpacing = 0;
	this.files = [];

	//Add element to document
	this.parent.appendChild(this.element);
}

//AssetExplorer conter
AssetExplorer.id = 0;

//Remove all files
AssetExplorer.prototype.clear = function()
{
	while(this.files.length > 0)
	{
		this.files.pop().destroy();
	}
}

//Add file to explorer
AssetExplorer.prototype.add = function(file)
{
	file.setParent(this.element);
	file.size.copy(this.filesSize);
	file.updateInterface();

	this.files.push(file);
}

//Remove element
AssetExplorer.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update AssetExplorer
AssetExplorer.prototype.update = function(){}

//Update division Size
AssetExplorer.prototype.updateInterface = function()
{
	//Element visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Update file position
	var filesPerRow = Math.floor(this.files.length / ((this.files.length * (this.filesSize.x+this.filesSpacing)) / this.size.x));
	for(var i = 0; i < this.files.length; i++)
	{
		var row = Math.floor(i / filesPerRow);
		var col = i % filesPerRow;
		this.files[i].position.x = (col * this.filesSize.x) + ((col+1) * this.filesSpacing);
		this.files[i].position.y = (row * this.filesSize.y) + ((row+1) * this.filesSpacing);
		this.files[i].updateInterface();
	}

	//Update element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
"use strict";

function AssetExplorer(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Assets", Editor.filePath + "icons/misc/new.png");

	this.element.ondragover = undefined;
	this.element.style.overflow = "visible";

	//Assets
	this.assets = document.createElement("div");
	this.assets.style.position = "absolute";
	this.assets.style.display = "block";
	this.assets.style.overflow = "auto";
	this.assets.style.top = "20px";
	this.assets.style.width = "100%";
	this.element.appendChild(this.assets);

	//Drop event
	this.element.ondrop = function(event)
	{
		//Dragged file into explorer
		for(var i = 0; i < event.dataTransfer.files.length; i++)
		{
			var file = event.dataTransfer.files[i];
			var name = file.name;

			//Image
			if(Image.fileIsImage(file))
			{
				Editor.loadTexture(file);
			}
			//Video
			else if(Video.fileIsVideo(file))
			{
				Editor.loadVideoTexture(file);
			}
			//Audio
			else if(Audio.fileIsAudio(file))
			{
				Editor.loadAudio(file);
			}
			//Font
			else if(Font.fileIsFont(file))
			{
				Editor.loadFont(file);
			}
		}
	};

	//Bar
	this.bar = new AssetExplorerMenu(this.element);

	//Search
	this.search = new TextBox(this.bar.element);
	this.search.setMode(Element.TOP_RIGHT);
	this.search.size.set(140, 15);
	this.search.position.set(2, 2);
	this.search.updateInterface();
	//TODO

	//Files in explorer
	this.files = [];

	//Add element to document
	this.parent.appendChild(this.element);
}

AssetExplorer.prototype = Object.create(TabElement.prototype);

AssetExplorer.prototype.activate = function()
{
	TabElement.prototype.activate.call(this);

	if(Editor.program !== null)
	{
		this.updateSelection();
	}
};

AssetExplorer.prototype.updateSettings = function()
{
	for(var i = 0; i < this.files.length; i++)
	{
		this.files[i].setSize(Editor.settings.general.filePreviewSize);
	}
};

AssetExplorer.prototype.updateSelection = function()
{
	for(var i = 0; i < this.files.length; i++)
	{
		this.files[i].updateSelection();
	}
};

AssetExplorer.prototype.updateObjectsView = function(changes)
{
	this.clear();

	ResourceManager.retrieveResources(Editor.program);

	//Materials
	var materials = Editor.program.materials;
	for(var i in materials)
	{
		var file = new MaterialAsset(this.assets);
		file.setAsset(materials[i]);
		this.add(file);
	}

	//Geometries
	/*var geometries = Editor.program.geometries;
	for(var i in geometries)
	{
		var file = new GeometryAsset(this.assets);
		file.setAsset(geometries[i]);
		this.add(file);
	}*/

	//Textures
	var textures = Editor.program.textures;
	for(var i in textures)
	{
		var file = new TextureAsset(this.assets);
		file.setAsset(textures[i]);
		this.add(file);
	}

	//Fonts
	var fonts = Editor.program.fonts;
	for(var i in fonts)
	{
		var file = new FontAsset(this.assets);
		file.setAsset(fonts[i]);
		this.add(file);
	}

	var images = Editor.program.images;
	for(var i in images)
	{
		var file = new ImageAsset(this.assets);
		file.setAsset(images[i]);
		this.add(file);
	}

	var videos = Editor.program.videos;
	for(var i in videos)
	{
		var file = new VideoAsset(this.assets);
		file.setAsset(videos[i]);
		this.add(file);
	}

	//Audio
	var audio = Editor.program.audio;
	for(var i in audio)
	{
		var file = new AudioAsset(this.assets);
		file.setAsset(audio[i]);
		this.add(file);
	}

	//Resources
	var resources = Editor.program.resources;
	for(var i in resources)
	{
		var resource = resources[i];

		var file = new FileAsset(this.assets);
		file.setAsset(resource);
		this.add(file);
	}

	this.updateInterface();
};

//Remove all files
AssetExplorer.prototype.clear = function()
{
	while(this.files.length > 0)
	{
		this.files.pop().destroy();
	}
};

//Add file to explorer
AssetExplorer.prototype.add = function(file)
{
	file.setParent(this.assets);
	file.setSize(Editor.settings.general.filePreviewSize);
	this.files.push(file);
};

//Update division
AssetExplorer.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.assets.style.height = (this.size.y - 20) + "px";

		this.element.style.display = "block";
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";
	}
	else
	{
		this.element.style.display = "none";
	}
};
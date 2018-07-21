"use strict";

function AssetExplorer(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Assets", Editor.filePath + "icons/misc/new.png");

	var self = this;

	this.element.ondragover = undefined;
	this.element.style.overflow = "visible";
	this.parent.appendChild(this.element);

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
	this.search.size.set(140, 17);
	this.search.position.set(2, 0);
	this.search.element.placeholder = "Search";
	this.search.updateInterface();
	this.search.setOnChange(function()
	{
		self.filterByName(this.value);
	});

	//Search icon
	this.searchIcon = document.createElement("img");
	this.searchIcon.style.position = "absolute";
	this.searchIcon.style.display = "block";
	this.searchIcon.style.top = "14px";
	this.searchIcon.style.width = "14px";
	this.searchIcon.style.top = "2px";
	this.searchIcon.style.right = "150px";
	this.searchIcon.src = Editor.filePath + "icons/misc/search.png";
	this.element.appendChild(this.searchIcon);

	//Files in explorer
	this.files = [];

	//Resource manager attached to the explorer
	this.manager = null;
}

AssetExplorer.prototype = Object.create(TabElement.prototype);

/**
 * Filter assets by their name.
 *
 * Only assets that contain the name will be shown.
 *
 * @method filterByName
 * @param {String} name String with portion of the name to be found and filtered.
 */
AssetExplorer.prototype.filterByName = function(search)
{
	search = search.toLowerCase();

	for(var i = 0; i < this.files.length; i++)
	{
		var text = this.files[i].name.data.toLowerCase();
		this.files[i].setVisibility(text.search(search) !== -1);
	}
};

AssetExplorer.prototype.activate = function()
{
	TabElement.prototype.activate.call(this);

	if(this.manager !== null)
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

AssetExplorer.prototype.attach = function(manager)
{
	if(this.manager !== manager)
	{	
		this.manager = manager;
		this.clear();
		this.updateObjectsView();
	}
};

AssetExplorer.prototype.updateObjectsView = function()
{
	this.clear();

	//Materials
	var materials = this.manager.materials;
	for(var i in materials)
	{
		var file = new MaterialAsset(this.assets);
		file.setAsset(materials[i]);
		this.add(file);
	}

	//Geometries
	/*var geometries = this.manager.geometries;
	for(var i in geometries)
	{
		var file = new GeometryAsset(this.assets);
		file.setAsset(geometries[i]);
		this.add(file);
	}*/

	//Textures
	var textures = this.manager.textures;
	for(var i in textures)
	{
		var file = new TextureAsset(this.assets);
		file.setAsset(textures[i]);
		this.add(file);
	}

	//Fonts
	var fonts = this.manager.fonts;
	for(var i in fonts)
	{
		var file = new FontAsset(this.assets);
		file.setAsset(fonts[i]);
		this.add(file);
	}

	var images = this.manager.images;
	for(var i in images)
	{
		var file = new ImageAsset(this.assets);
		file.setAsset(images[i]);
		this.add(file);
	}

	var videos = this.manager.videos;
	for(var i in videos)
	{
		var file = new VideoAsset(this.assets);
		file.setAsset(videos[i]);
		this.add(file);
	}

	//Audio
	var audio = this.manager.audio;
	for(var i in audio)
	{
		var file = new AudioAsset(this.assets);
		file.setAsset(audio[i]);
		this.add(file);
	}

	//Resources
	var resources = this.manager.resources;
	for(var i in resources)
	{
		var resource = resources[i];

		var file = new FileAsset(this.assets);
		file.setAsset(resource);
		this.add(file);
	}
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
	file.setSize(Editor.settings.general.filePreviewSize);
	this.files.push(file);
};

AssetExplorer.prototype.updateSize = function()
{
	Element.prototype.updateSize.call(this);

	this.assets.style.height = (this.size.y - 20) + "px";
};
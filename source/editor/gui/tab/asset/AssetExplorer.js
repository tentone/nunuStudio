"use strict";

function AssetExplorer(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Assets", Global.FILE_PATH + "icons/misc/new.png");

	var self = this;

	this.element.ondragover = undefined;

	//Assets
	this.assets = new Element(this, "div");
	this.assets.element.style.overflow = "auto";

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
	this.bar = new AssetExplorerMenu(this);

	/**
	 * Search box to filter by name.
	 *
	 * @property search
	 * @type {SearchBox}
	 */
	this.search = new SearchBox(this.bar);
	this.search.setMode(Element.TOP_RIGHT);
	this.search.size.set(200, 25);
	this.search.position.set(1, 0);
	this.search.updateInterface();
	this.search.setOnChange(function()
	{
		self.filterByName(self.search.search.getText());
	});

	/**
	 * Assets in explorer.
	 *
	 * @property files
	 * @type {Array}
	 */
	this.files = [];

	/**
	 * Resource manager attached to the explorer.
	 *
	 * @property manager
	 * @type {ResourceManger}
	 */
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

AssetExplorer.prototype.updateSettings = function()
{
	for(var i = 0; i < this.files.length; i++)
	{
		this.files[i].setSize(Editor.settings.general.filePreviewSize);
	}
};

/**
 * Attach a resource manager to this explorer.
 *
 * @method attach
 * @param {ResourceManager} manager.
 */
AssetExplorer.prototype.attach = function(manager)
{
	if(this.manager !== manager)
	{	
		this.manager = manager;
		this.updateObjectsView();
	}
};

/** 
 * Add asset to the explorer.
 *
 * @method add
 * @param {Asset} file
 */
AssetExplorer.prototype.add = function(file)
{
	file.setSize(Editor.settings.general.filePreviewSize);
	this.files.push(file);
};

/**
 * Update the full object view in the asset explorer.
 *
 * Should only be used to initialize the explorer the first time. After it gets initialized use the add and remove methods.
 *
 * @method updateObjectsView
 */
AssetExplorer.prototype.updateObjectsView = function()
{
	//TODO <USE ONLY TO INITIALIZE THE EXPLORER>

	this.clear();

	//Materials
	var materials = this.manager.materials;
	for(var i in materials)
	{
		var file = new MaterialAsset(this.assets);
		file.attach(materials[i]);
		this.add(file);
	}

	//Geometries
	var geometries = this.manager.geometries;
	for(var i in geometries)
	{
		var file = new GeometryAsset(this.assets);
		file.attach(geometries[i]);
		this.add(file);
	}

	//Textures
	var textures = this.manager.textures;
	for(var i in textures)
	{
		var file = new TextureAsset(this.assets);
		file.attach(textures[i]);
		this.add(file);
	}

	//Fonts
	var fonts = this.manager.fonts;
	for(var i in fonts)
	{
		var file = new FontAsset(this.assets);
		file.attach(fonts[i]);
		this.add(file);
	}

	var images = this.manager.images;
	for(var i in images)
	{
		var file = new ImageAsset(this.assets);
		file.attach(images[i]);
		this.add(file);
	}

	var videos = this.manager.videos;
	for(var i in videos)
	{
		var file = new VideoAsset(this.assets);
		file.attach(videos[i]);
		this.add(file);
	}

	//Audio
	var audio = this.manager.audio;
	for(var i in audio)
	{
		var file = new AudioAsset(this.assets);
		file.attach(audio[i]);
		this.add(file);
	}

	//Resources
	var resources = this.manager.resources;
	for(var i in resources)
	{
		var resource = resources[i];

		var file = new FileAsset(this.assets);
		file.attach(resource);
		this.add(file);
	}
};

/** 
 * Clear the explorer, remove all assets.
 *
 * @method clear
 */
AssetExplorer.prototype.clear = function()
{
	while(this.files.length > 0)
	{
		this.files.pop().destroy();
	}
};

AssetExplorer.prototype.updateSize = function()
{
	Element.prototype.updateSize.call(this);

	this.bar.size.set(this.size.x, 25);
	this.bar.updateSize();

	this.assets.position.set(0, 25);
	this.assets.size.set(this.size.x, this.size.y - 20);
	this.assets.updateInterface();
};
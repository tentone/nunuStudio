//Alternative Textureloader (Based on the original from THREEJS made by drdoob)
function TextureLoader(manager)
{
	if(manager !== undefined)
	{
		this.manager = manager;
	}
	else
	{
		this.manager = THREE.DefaultLoadingManager;
	}

	this.path = null;
	this.crossOrigin = null;
}


//Function prototypes
TextureLoader.prototype.load = load;
TextureLoader.prototype.setCrossOrigin = setCrossOrigin;
TextureLoader.prototype.setPath = setPath;

//Load texture sync
TextureLoader.load = function(url, mapping, onLoad, onError)
{
	var loader = new THREE.TextureLoader();
	var texture = loader.load(url, onLoad, undefined, onError);

	if(mapping)
	{
		texture.mapping = mapping;
	}

	return texture;
}

//Load texture async
function load(url, onLoad, onProgress, onError)
{
	if(this.path !== null)
	{
		url = this.path + url;
	}

	//Self pointer
	var self = this;
	var cached = Cache.get(url);

	if(cached !== undefined)
	{
		self.manager.itemStart(url);

		if(onLoad)
		{
			setTimeout(function()
			{
				onLoad(cached);
				self.manager.itemEnd(url);
			}, 0);
		}
		else
		{
			self.manager.itemEnd(url);
		}

		return cached;
	}

	var image = document.createElement("img");

	image.addEventListener("load", function(event)
	{
		Cache.add(url, this);
		if(onLoad)
		{
			onLoad(this);
		}
		self.manager.itemEnd(url);
	}, false);

	if(onProgress !== undefined)
	{
		image.addEventListener("progress", function(event)
		{
			onProgress(event);
		}, false);
	}

	image.addEventListener("error", function(event)
	{
		if(onError)
		{
			onError(event);
		}
		self.manager.itemError(url);
	}, false);

	if(this.crossOrigin !== null)
	{
		image.crossOrigin = this.crossOrigin;
	}

	self.manager.itemStart(url);
	image.src = url;

	return image;
}

//Set cross origin directory
function setCrossOrigin(value)
{
	this.crossOrigin = value;
}

//Set working path for this loader
function setPath(value)
{
	this.path = value;
}

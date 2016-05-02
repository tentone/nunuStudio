function TextureLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : DefaultLoadingManager;
}

//Function prototypes
TextureLoader.prototype.load = load;
TextureLoader.prototype.parse = parse;
TextureLoader.prototype.setCrossOrigin = setCrossOrigin;
TextureLoader.prototype.setPath = setPath;

//Load image sync
function parse(data)
{
	//TODO <ADD CODE HERE>
}

//Load image
function load(url, onLoad, onProgress, onError)
{
	if ( this.path !== undefined ) url = this.path + url;

	var scope = this;
	var cached = Cache.get(url);

	if(cached !== undefined)
	{
		scope.manager.itemStart( url );

		if(onLoad)
		{
			setTimeout(function()
			{
				onLoad(cached);
				scope.manager.itemEnd(url);
			}, 0);
		}
		else
		{
			scope.manager.itemEnd(url);
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
		scope.manager.itemEnd(url);
	}, false);

	if(onProgress !== undefined)
	{
		image.addEventListener("progress", function(event)
		{
			onProgress(event);
		}, false);
	}

	image.addEventListener("error", function (event)
	{
		if(onError)
		{
			onError(event);
		}

		scope.manager.itemError(url);
	}, false);

	if(this.crossOrigin !== undefined)
	{
		image.crossOrigin = this.crossOrigin;
	}

	scope.manager.itemStart(url);
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

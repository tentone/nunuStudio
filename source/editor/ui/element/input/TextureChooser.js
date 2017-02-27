"use strict";

function TextureChooser(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";

	//Preview
	this.preview = document.createElement("div");
	this.preview.style.cursor = "pointer";
	this.preview.style.visibility = "inherit";
	this.preview.style.position = "absolute";
	this.preview.style.top = "0px";
	this.preview.style.left = "0px";
	this.element.appendChild(this.preview);

	//Alpha background
	this.alpha = document.createElement("img");
	this.alpha.src = "editor/files/alpha.png";
	this.alpha.style.visibility = "inherit";
	this.alpha.style.pointerEvents = "none";
	this.alpha.style.position = "absolute";
	this.alpha.style.left = "0px";
	this.alpha.style.top = "0px";
	this.alpha.style.width = "100%";
	this.alpha.style.height = "100%";
	this.preview.appendChild(this.alpha);

	//Image
	this.img = document.createElement("img");
	this.img.style.pointerEvents = "none";
	this.img.style.position = "absolute";
	this.img.style.left = "0px";
	this.img.style.top = "0px";
	this.img.style.width = "100%";
	this.img.style.height = "100%";
	this.preview.appendChild(this.img);

	//Video
	this.video = document.createElement("video");
	this.video.autoplay = true;
	this.video.loop = true;
	this.video.volume = 0.0;
	this.video.style.pointerEvents = "none";
	this.video.style.position = "absolute";
	this.video.style.left = "0px";
	this.video.style.top = "0px";
	this.video.style.width = "100%";
	this.video.style.height = "100%";
	this.preview.appendChild(this.video);

	//Self pointer
	var self = this;

	//On drop get file dropped
	this.preview.ondrop = function(event)
	{
		//File dragged
		if(event.dataTransfer.files.length > 0)
		{
			self.loadTexture(event.dataTransfer.files[0]);
		}
		//Resouce dragged
		else
		{
			var uuid = event.dataTransfer.getData("uuid");
			var texture = DragBuffer.popDragElement(uuid);
			if(texture instanceof THREE.Texture && !(texture instanceof CubeTexture))
			{
				self.setTexture(texture);
			}
		}

		event.preventDefault();
	};

	//Onclick select image or video file
	this.preview.onclick = function()
	{
		if(self.onChange !== null)
		{
			FileSystem.chooseFile(function(files)
			{
				if(files.length > 0)
				{
					self.loadTexture(files[0]);
				}
			}, "image/*, video/*, .tga");
		}
	};

	//onChange function
	this.onChange = null;

	//Attributes
	this.size = new THREE.Vector2(100, 100);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Texture
	this.texture = null;

	//Add element to document
	this.parent.appendChild(this.element);
}

//Set onChange onChange function
TextureChooser.prototype.setOnChange = function(onChange)
{
	this.onChange = onChange;
};

//Remove element
TextureChooser.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
};

//Set texture value
TextureChooser.prototype.setValue = function(texture)
{
	if(texture instanceof THREE.Texture && !(texture instanceof CubeTexture))
	{
		this.texture = texture;
		this.updatePreview();
	}
	else
	{
		this.texture = null;
	}
};

//Get texture value
TextureChooser.prototype.getValue = function()
{
	return this.texture;
};

//Set Texture
TextureChooser.prototype.setTexture = function(texture)
{
	this.setValue(texture);

	if(this.onChange !== null)
	{
		this.onChange();
	}
};

//Load texture from file
TextureChooser.prototype.loadTexture = function(file)
{
	var self = this;
	var onLoad = function(texture)
	{
		self.texture = texture;
		self.updatePreview();

		if(self.onChange !== null)
		{
			self.onChange();
		}
	};

	if(Image.fileIsImage(file))
	{
		Editor.loadTexture(file, onLoad);
	}
	else if(Video.fileIsVideo(file))
	{
		Editor.loadVideoTexture(file, onLoad);
	}
};

//Update texture preview
TextureChooser.prototype.updatePreview = function()
{
	var texture = this.texture;

	if(texture instanceof Texture)
	{
		this.video.visibility = "hidden";
		this.video.src = "";
		this.img.visibility = "visible";
		this.img.src = texture.image.src;
	}
	if(texture instanceof CanvasTexture)
	{
		this.video.visibility = "hidden";
		this.video.src = "";
		this.img.visibility = "visible";
		this.img.src = texture.image.toDataURL();
	}
	else if(texture instanceof VideoTexture || texture instanceof WebcamTexture)
	{
		this.img.visibility = "hidden";
		this.img.src = "";
		this.video.visibility = "visible";
		this.video.src = texture.image.src;
	}
};

//Update Interface
TextureChooser.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Preview
	this.preview.style.width = this.size.x + "px";
	this.preview.style.height = this.size.y + "px";

	//Element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
};

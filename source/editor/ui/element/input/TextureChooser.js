"use strict";

function TextureChooser(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Base element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";

	//Texture preview division
	this.preview = document.createElement("div");
	this.preview.style.cursor = "pointer";
	this.preview.style.position = "absolute";
	this.preview.style.top = "0px";
	this.preview.style.left = "0px";
	this.element.appendChild(this.preview);

	//Alpha background
	this.alpha = document.createElement("img");
	this.alpha.src = "editor/files/alpha.png";
	this.alpha.style.pointerEvents = "none";
	this.alpha.style.position = "absolute";
	this.alpha.style.left = "0px";
	this.alpha.style.top = "0px";
	this.preview.appendChild(this.alpha);

	//Image
	this.img = document.createElement("img");
	this.img.style.pointerEvents = "none";
	this.img.style.position = "absolute";
	this.img.style.left = "0px";
	this.img.style.top = "0px";
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
	this.preview.appendChild(this.video);

	//Self pointer
	var self = this;

	//On drop get file dropped
	this.preview.ondrop = function(event)
	{
		//File dragged
		if(event.dataTransfer.files.length > 0)
		{
			var file = event.dataTransfer.files[0];
			self.loadTexture(file);
		}
		//Resouce dragged
		else
		{
			var uuid = event.dataTransfer.getData("uuid");
			var texture = DragBuffer.popDragElement(uuid);
			if(texture instanceof THREE.Texture)
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
	this.size = new THREE.Vector2(300, 100);
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
}

//Remove element
TextureChooser.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update
TextureChooser.prototype.update = function(){}

//Set texture value
TextureChooser.prototype.setValue = function(texture)
{
	if(texture === null || texture === undefined)
	{
		this.texture = null;
	}
	else
	{
		this.texture = texture;
		this.updatePreview();
	}
}

//Get texture value
TextureChooser.prototype.getValue = function()
{
	if(this.texture !== null)
	{
		this.texture.needsUpdate = true;
		return this.texture;
	}

	return null;
}

//Set Texture
TextureChooser.prototype.setTexture = function(texture)
{
	this.setValue(texture);

	if(this.onChange !== null)
	{
		this.onChange();
	}
}

//Load texture from file
TextureChooser.prototype.loadTexture = function(file)
{
	//Image
	if(file.type.startsWith("image") || file.path.endsWith("tga"))
	{
		this.texture = new Texture(new Image(file.path));
	}
	//Video
	else if(file.type.startsWith("video"))
	{
		this.texture = new VideoTexture(new Video(file.path));
	}

	if(this.onChange !== null)
	{
		this.onChange();
	}

	this.updatePreview();
}

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
}

//Update Interface
TextureChooser.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
		this.preview.style.visibility = "visible";
		this.alpha.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
		this.preview.style.visibility = "hidden";
		this.alpha.style.visibility = "hidden";
	}

	//Preview
	this.preview.style.width = this.size.y + "px";
	this.preview.style.height = this.size.y + "px";
	this.img.width = this.size.y;
	this.img.height = this.size.y;
	this.video.width = this.size.y;
	this.video.height = this.size.y;
	this.alpha.width = this.size.y;
	this.alpha.height = this.size.y;

	//Element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}

"use strict";

function TextureBox(parent)
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
		if(self.onchange !== null)
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

	//Form
	this.form = new Form(this.element);
	this.form.defaultTextWidth = 60;
	this.form.spacing.set(10, 5);

	//Use texture
	this.form.addText("Use texture");
	this.useTexture = new CheckBox(this.form.element);
	this.useTexture.size.set(30, 15);
	this.form.add(this.useTexture);
	this.form.nextRow();

	//WrapS
	this.form.addText("Wrap Hor");
	this.wrapS = new DropdownList(this.element);
	this.wrapS.size.set(120, 18);
	this.wrapS.addValue("Clamp to edge", THREE.ClampToEdgeWrapping);
	this.wrapS.addValue("Repeat", THREE.RepeatWrapping);
	this.wrapS.addValue("Repeat mirrored", THREE.MirroredRepeatWrapping);
	this.form.add(this.wrapS);
	this.form.nextRow();

	//WrapT
	this.form.addText("Wrap Vert");
	this.wrapT = new DropdownList(this.element);
	this.wrapT.size.set(120, 18);
	this.wrapT.addValue("Clamp to edge", THREE.ClampToEdgeWrapping);
	this.wrapT.addValue("Repeat", THREE.RepeatWrapping);
	this.wrapT.addValue("Repeat mirrored", THREE.MirroredRepeatWrapping);
	this.form.add(this.wrapT);
	this.form.nextRow();

	//Repeat
	this.form.addText("Repeat");
	this.repeat = new CoordinatesBox(this.element);
	this.repeat.setMode(CoordinatesBox.VECTOR2);
	this.repeat.size.set(120, 18);
	this.repeat.setValue(1, 1, 0);
	this.form.add(this.repeat);
	this.form.updateInterface();

	//On change function
	this.onchange = null;

	//Element atributes
	this.fitParent = false;
	this.size = new THREE.Vector2(300, 100);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Texture
	this.texture = null;

	//Add element to document
	this.parent.appendChild(this.element);
}

//Set onchange onChange function
TextureBox.prototype.setOnChange = function(onChange)
{
	this.onchange = onChange;
	this.useTexture.setOnChange(onChange);
	this.wrapT.setOnChange(onChange);
	this.wrapS.setOnChange(onChange);
	this.repeat.setOnChange(onChange);
}

//Remove element
TextureBox.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update
TextureBox.prototype.update = function(){}

//Set texture value
TextureBox.prototype.setValue = function(texture)
{
	if(texture === null || texture === undefined)
	{
		this.useTexture.setValue(false);
		this.texture = null;
	}
	else
	{
		this.texture = texture;

		//Update UI elements
		this.useTexture.setValue(true);
		this.wrapS.setValue(texture.wrapS);
		this.wrapT.setValue(texture.wrapT);
		this.repeat.setValue(texture.repeat.x, texture.repeat.y);
		this.updatePreview();
	}
}

//Get texture value
TextureBox.prototype.getValue = function()
{
	if(this.useTexture.getValue())
	{
		if(this.texture !== null)
		{
			this.texture.wrapS = this.wrapS.getValue();
			this.texture.wrapT = this.wrapT.getValue();
			this.texture.repeat.copy(this.repeat.getValue());
			this.texture.needsUpdate = true;

			return this.texture;
		}
	}

	return null;
}

//Set Texture
TextureBox.prototype.setTexture = function(texture)
{
	this.setValue(texture);

	if(this.onchange !== null)
	{
		this.onchange();
	}
}

//Load texture from file
TextureBox.prototype.loadTexture = function(file)
{
	//Image
	if(file.type.startsWith("image") || file.path.endsWith("tga"))
	{
		this.texture = new Texture(new Image(file.path));
		this.useTexture.setValue(true);
	}
	//Video
	else if(file.type.startsWith("video"))
	{
		this.texture = new VideoTexture(new Video(file.path));
		this.useTexture.setValue(true);
	}

	if(this.onchange !== null)
	{
		this.onchange();
	}

	this.updatePreview();
}

//Update texture preview
TextureBox.prototype.updatePreview = function()
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
TextureBox.prototype.updateInterface = function()
{
	if(this.fitParent)
	{
		this.size.x = this.parent.offsetWidth;
		this.size.y = this.parent.offsetHeight; 
	}

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

	//Auxiliar form
	this.form.position.set(this.size.y + 5, 0);
	this.form.size.set(this.size.x - this.form.position.x, this.size.y)
	this.form.visible = this.visible;
	this.form.updateInterface();

	//Base element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}

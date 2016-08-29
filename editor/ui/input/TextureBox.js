"use strict";

function TextureBox(parent)
{
	//Parent
	if(parent === undefined)
	{
		this.parent = document.body;
	}
	else
	{
		this.parent = parent;
	}

	//ID
	var id = "texture_box" + TextureBox.id;
	TextureBox.id++;

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
		if(event.dataTransfer.files.length > 0)
		{
			var file = event.dataTransfer.files[0];

			//Image
			if(file.type.startsWith("image"))
			{
				self.texture = new Texture(file.path);
				self.use_texture.setValue(true);
				if(self.onchange !== null)
				{
					self.onchange();
				}
				self.updatePreview();
			}
			//Video
			else if(file.type.startsWith("video"))
			{
				self.texture = new VideoTexture(new Video(file.path));
				self.use_texture.setValue(true);
				if(self.onchange !== null)
				{
					self.onchange();
				}
				self.updatePreview();
			}
		}
		event.preventDefault();
	};

	//Onclick select image or video file
	this.preview.onclick = function()
	{
		if(self.onchange !== null)
		{
			App.chooseFile(function(file)
			{
				self.texture = new Texture(file);
				self.use_texture.setValue(true);
				if(self.onchange !== null)
				{
					self.onchange();
				}
				self.updatePreview();
			}, "image/*");
		}
	};

	//Side elements form
	this.form = new Form(this.element);
	this.form.position.set(105, 0);
	this.form.spacing.set(10, 5);

	//Use texture
	this.use_texture = new CheckBox(this.form.element);
	this.use_texture.setText("Use texture");
	this.use_texture.size.set(120, 15);
	this.form.add(this.use_texture);
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
	this.repeat.setValue(1, 1, 0);
	this.form.add(this.repeat);
	this.form.updateInterface();

	//On change function
	this.onchange = null;

	//Element atributes
	this.fit_parent = false;
	this.size = new THREE.Vector2(300, 100);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Texture
	this.texture = null;

	//Add element to document
	this.parent.appendChild(this.element);
}

//TextureBox ID counter
TextureBox.id = 0;

//Set onchange callback function
TextureBox.prototype.setOnChange = function(callback)
{
	this.onchange = callback;
	this.use_texture.setOnChange(callback);
	this.wrapT.setOnChange(callback);
	this.wrapS.setOnChange(callback);
	this.repeat.setOnChange(callback);
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
		this.use_texture.setValue(false);
		this.texture = null;
	}
	else
	{
		this.texture = texture;

		this.use_texture.setValue(true);
		this.wrapS.setValue(texture.wrapS);
		this.wrapT.setValue(texture.wrapT);
		this.repeat.setValue(texture.repeat.x, texture.repeat.y);

		this.updatePreview();
	}
}

//Get image URL
TextureBox.prototype.getValue = function()
{
	if(this.use_texture.getValue())
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
	if(this.fit_parent)
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
	this.form.visible = this.visible;
	this.form.updateInterface();

	//Base element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}

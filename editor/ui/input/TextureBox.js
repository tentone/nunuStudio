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
	this.preview.style.position = "absolute";
	this.preview.style.top = "0px";
	this.preview.style.left = "0px";
	this.element.appendChild(this.preview);

	//Alpha background
	this.alpha = document.createElement("img");
	this.alpha.src = "editor/files/alpha.png";
	this.alpha.style.position = "absolute";
	this.alpha.style.left = "0px";
	this.alpha.style.top = "0px";
	this.preview.appendChild(this.alpha);

	//Image
	this.img = document.createElement("img");
	this.img.style.position = "absolute";
	this.img.style.left = "0px";
	this.img.style.top = "0px";
	this.img.src = "";
	this.preview.appendChild(this.img);

	//Self pointer
	var self = this;

	//On drop get file dropped
	this.preview.ondrop = function(event)
	{
		event.preventDefault();

		if(event.dataTransfer.files.length > 0)
		{
			//Get first file from event
			var file = event.dataTransfer.files[0];

			//Check if its a image
			if(file.type.startsWith("image"))
			{
				self.img.src = file.path;
				self.use_texture.setValue(true);
				self.onchange();
			}
		}
	};

	//Onclick select image file
	this.preview.onclick = function()
	{
		if(self.onchange !== null)
		{
			App.chooseFile(function(file)
			{
				self.img.src = file;
				self.use_texture.setValue(true);
				self.onchange();
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

//Functions Prototype
TextureBox.prototype.setOnChange = setOnChange;
TextureBox.prototype.setValue = setValue;
TextureBox.prototype.getValue = getValue;
TextureBox.prototype.update = update;
TextureBox.prototype.updateInterface = updateInterface;
TextureBox.prototype.destroy = destroy;

//Set onchange callback function
function setOnChange(callback)
{
	this.onchange = callback;
	this.use_texture.setOnChange(callback);
	this.wrapT.setOnChange(callback);
	this.wrapS.setOnChange(callback);
	this.repeat.setOnChange(callback);
}

//Remove element
function destroy()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update
function update(){}

//Set image from URL
function setValue(texture)
{
	this.texture = texture;

	if(texture === null)
	{
		this.img.src = "";
		this.use_texture.setValue(false);
	}
	else
	{
		this.img.src = texture.image.src;
		this.use_texture.setValue(true);
		this.wrapS.setValue(texture.wrapS);
		this.wrapT.setValue(texture.wrapT);
		this.repeat.setValue(texture.repeat.x, texture.repeat.y);
	}
}

//Get image URL
function getValue()
{
	if(this.use_texture.getValue())
	{
		if(this.texture !== null)
		{
			this.texture.image.src = this.img.src;
		}
		else if(this.img.src !== "")
		{
			this.texture = new Texture(this.img.src);
		}
		else
		{
			return null;
		}

		this.texture.wrapS = this.wrapS.getValue();
		this.texture.wrapT = this.wrapT.getValue();
		this.texture.repeat.copy(this.repeat.getValue());
		this.texture.needsUpdate = true;
		return this.texture;
	}

	return null;
}

//Update Interface
function updateInterface()
{
	//Fit parent element
	if(this.fit_parent)
	{
		this.size.x = this.parent.offsetWidth;
		this.size.y = this.parent.offsetHeight; 
	}

	//Set visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
		this.preview.style.visibility = "visible";
		this.img.style.visibility = "visible";
		this.alpha.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
		this.preview.style.visibility = "hidden";
		this.img.style.visibility = "hidden";
		this.alpha.style.visibility = "hidden";
	}

	//Update preview elements
	this.preview.style.width = this.size.y + "px";
	this.preview.style.height = this.size.y + "px";
	this.img.width = this.size.y;
	this.img.height = this.size.y;
	this.alpha.width = this.size.y;
	this.alpha.height = this.size.y;

	//Update auxiliar form
	this.form.visible = this.visible;
	this.form.updateInterface();

	//Update base element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}

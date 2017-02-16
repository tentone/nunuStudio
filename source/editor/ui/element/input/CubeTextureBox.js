"use strict";

function CubeTextureBox(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Base element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";

	//Preview division
	this.preview = document.createElement("div");
	this.preview.style.cursor = "pointer";
	this.preview.style.position = "absolute";
	this.preview.style.top = "0px";
	this.preview.style.left = "0px";
	this.preview.style.width = "100%";
	this.preview.style.heihg = "100%";
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
	this.alpha.style.heihg = "100%";
	this.preview.appendChild(this.alpha);

	//Image
	this.img = document.createElement("img");
	this.img.style.visibility = "inherit";
	this.img.style.pointerEvents = "none";
	this.img.style.position = "absolute";
	this.img.style.left = "0px";
	this.img.style.top = "0px";
	this.img.style.width = "100%";
	this.img.style.heihg = "100%";
	this.preview.appendChild(this.img);

	//Self pointer
	var self = this;

	//On drop get file dropped
	this.preview.ondrop = function(event)
	{
		//Resouce dragged
		var uuid = event.dataTransfer.getData("uuid");
		var texture = DragBuffer.popDragElement(uuid);
		if(texture instanceof CubeTexture)
		{
			self.setTexture(texture);
		}

		event.preventDefault();
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

	//Mapping
	this.form.addText("Mapping");
	this.mapping = new DropdownList(this.form.element);
	this.mapping.size.set(60, 18);
	this.mapping.addValue("Reflection", THREE.CubeReflectionMapping);
	this.mapping.addValue("Refraction", THREE.CubeRefractionMapping);
	this.mapping.setOnChange(function()
	{
		if(self.texture !== null)
		{
			self.texture.mapping = self.mapping.getValue();
			self.updateMaterial();
		}
	});
	this.form.add(this.mapping);
	this.form.nextRow();

	//onChange callback
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
CubeTextureBox.prototype.setOnChange = function(onChange)
{
	this.onChange = onChange;
	this.useTexture.setOnChange(onChange);
	this.mapping.setOnChange(onChange);
}

//Remove element
CubeTextureBox.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update
CubeTextureBox.prototype.update = function(){}

//Set texture value
CubeTextureBox.prototype.setValue = function(texture)
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
		this.mapping.setValue(texture.mapping);
		this.updatePreview();
	}
}

//Get texture value
CubeTextureBox.prototype.getValue = function()
{
	if(this.useTexture.getValue())
	{
		if(this.texture !== null)
		{
			this.texture.mapping = this.mapping.getValue();
			this.texture.needsUpdate = true;

			return this.texture;
		}
	}

	return null;
}

//Set Texture
CubeTextureBox.prototype.setTexture = function(texture)
{
	this.setValue(texture);

	if(this.onChange !== null)
	{
		this.onChange();
	}
}

//Update texture preview
CubeTextureBox.prototype.updatePreview = function()
{
	this.img.src = texture.images[0].data;
}

//Update Interface
CubeTextureBox.prototype.updateInterface = function()
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

	//Form
	this.form.position.set(this.size.y + 5, 0);
	this.form.size.set(this.size.x - this.form.position.x, this.size.y)
	this.form.visible = this.visible;
	this.form.updateInterface();

	//Element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}

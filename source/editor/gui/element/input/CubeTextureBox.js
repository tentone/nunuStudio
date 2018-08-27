"use strict";

function CubeTextureBox(parent)
{
	Element.call(this, parent, "div");

	//Texture preview division
	this.preview = document.createElement("div");
	this.preview.style.cursor = "pointer";
	this.preview.style.position = "absolute";
	this.preview.style.top = "0px";
	this.preview.style.left = "0px";
	this.element.appendChild(this.preview);

	//Alpha background
	this.alpha = document.createElement("img");
	this.alpha.src = Editor.filePath + "alpha.png";
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

	//Self pointer
	var self = this;

	//On drop get file dropped
	this.preview.ondrop = function(event)
	{
		var uuid = event.dataTransfer.getData("uuid");
		var texture = DragBuffer.get(uuid);

		if(texture.isCubeTexture)
		{
			self.setTexture(texture);
		}

		event.preventDefault();
	};

	//Form
	this.form = new Form(this);
	this.form.defaultTextWidth = 60;
	this.form.spacing.set(10, 5);

	//Use texture
	this.form.addText("Use texture");
	this.useTexture = new CheckBox(this.form);
	this.useTexture.size.set(30, 15);
	this.form.add(this.useTexture);
	this.form.nextRow();

	//WrapS
	this.form.addText("Mapping");
	this.mapping = new DropdownList(this);
	this.mapping.size.set(120, 18);
	this.mapping.addValue("Reflection Mapping", THREE.CubeReflectionMapping);
	this.mapping.addValue("Refraction Mapping", THREE.CubeRefractionMapping);
	this.form.add(this.mapping);
	this.form.nextRow();

	//onChange function
	this.onChange = null;

	//Texture
	this.texture = null;
}

CubeTextureBox.prototype = Object.create(Element.prototype);

//Set onChange onChange function
CubeTextureBox.prototype.setOnChange = function(onChange)
{
	this.onChange = onChange;
	this.useTexture.setOnChange(onChange);
	this.mapping.setOnChange(onChange);
};

//Set texture value
CubeTextureBox.prototype.setValue = function(texture)
{
	if(texture !== null && texture.isCubeTexture)
	{
		this.texture = texture;

		this.useTexture.setValue(true);
		this.mapping.setValue(texture.mapping);

		this.updatePreview();

	}
	else
	{
		this.useTexture.setValue(false);
		this.texture = null;
	}
};

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
};

//Set Texture
CubeTextureBox.prototype.setTexture = function(texture)
{
	this.setValue(texture);

	if(this.onChange !== null)
	{
		this.onChange();
	}
};

//Update texture preview
CubeTextureBox.prototype.updatePreview = function()
{
	if(this.texture instanceof CubeTexture)
	{
		this.img.src = this.texture.images[0].data;
	}
	else if(this.texture instanceof CompressedTexture)
	{
		//TODO <ADD CODE HERE>
		this.img.src = Editor.filePath + "icon.png";
	}
};

//Update Interface
CubeTextureBox.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	
		//Preview
		this.preview.style.width = this.size.y + "px";
		this.preview.style.height = this.size.y + "px";

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
	else
	{
		this.element.style.visibility = "hidden";
	}

};

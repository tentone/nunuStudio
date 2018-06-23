"use strict";

function TextureBox(parent)
{
	TextureChooser.call(this, parent);

	this.element.style.overflow = "visible";
	
	//Form
	this.form = new Form(this.element);
	this.form.defaultTextWidth = 60;
	this.form.spacing.set(10, 5);

	//Use texture
	this.form.addText("Use texture");
	this.useTexture = new CheckBox(this.form.element);
	this.useTexture.size.set(15, 15);
	this.form.add(this.useTexture);
	this.form.nextRow();

	//WrapS
	this.form.addText("Wrap Hor");
	this.wrapS = new DropdownList(this.element);
	this.wrapS.size.set(120, 18);
	this.wrapS.addValue("Clamp to Edge", THREE.ClampToEdgeWrapping);
	this.wrapS.addValue("Repeat", THREE.RepeatWrapping);
	this.wrapS.addValue("Repeat Mirrored", THREE.MirroredRepeatWrapping);
	this.form.add(this.wrapS);
	this.form.nextRow();

	//WrapT
	this.form.addText("Wrap Vert");
	this.wrapT = new DropdownList(this.element);
	this.wrapT.size.set(120, 18);
	this.wrapT.addValue("Clamp to Edge", THREE.ClampToEdgeWrapping);
	this.wrapT.addValue("Repeat", THREE.RepeatWrapping);
	this.wrapT.addValue("Repeat Mirrored", THREE.MirroredRepeatWrapping);
	this.form.add(this.wrapT);
	this.form.nextRow();

	//Repeat
	this.form.addText("Repeat");
	this.repeat = new VectorBox(this.element);
	this.repeat.setType(VectorBox.VECTOR2);
	this.repeat.size.set(120, 18);
	this.repeat.setValue(1, 1, 0);
	this.form.add(this.repeat);
}

TextureBox.prototype = Object.create(TextureChooser.prototype);

//Set onChange onChange function
TextureBox.prototype.setOnChange = function(onChange)
{
	TextureChooser.prototype.setOnChange.call(this, onChange);

	this.useTexture.setOnChange(onChange);
	this.wrapT.setOnChange(onChange);
	this.wrapS.setOnChange(onChange);
	this.repeat.setOnChange(onChange);
};

//Set texture value
TextureBox.prototype.setValue = function(texture)
{
	if(texture instanceof THREE.Texture && !texture.isCubeTexture)
	{
		this.texture = texture;

		this.useTexture.setValue(true);
		this.wrapS.setValue(texture.wrapS);
		this.wrapT.setValue(texture.wrapT);
		this.repeat.setValue(texture.repeat.x, texture.repeat.y);

		this.updatePreview();
	}
	else
	{
		this.texture = null;
	}
};

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
};

//Load texture from file
TextureBox.prototype.loadTexture = function(file)
{
	var self = this;
	var onLoad = function(texture)
	{
		self.texture = texture;
		self.useTexture.setValue(true);
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

//Update Interface
TextureBox.prototype.updateSize = function()
{
	TextureChooser.prototype.updateSize.call(this);

	//Form
	this.form.position.set(this.size.y + 5, 0);
	this.form.size.set(this.size.x - this.form.position.x, this.size.y)
	this.form.visible = this.visible;
	this.form.updateInterface();
};

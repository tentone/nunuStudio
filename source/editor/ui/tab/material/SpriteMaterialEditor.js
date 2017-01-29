"use strict";

function SpriteMaterialEditor(parent)
{
	MaterialEditor.call(this, parent);

	var self = this;

	//Color
	this.form.addText("Color");
	this.color = new ColorChooser(this.form.element);
	this.color.size.set(100, 18);
	this.color.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.color.setHex(self.color.getValueHex());
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.color);
	this.form.nextRow();

	//Rotation
	this.form.addText("Rotation");
	this.rotation = new NumberBox(this.form.element);
	this.rotation.size.set(60, 18);
	this.rotation.setStep(0.01);
	this.rotation.updateInterface();
	this.rotation.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.rotation = self.rotation.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.rotation);
	this.form.nextRow();

	//Texture map
	this.form.addText("Texture map");
	this.form.nextRow();
	this.map = new TextureBox(this.form.element);
	this.map.size.set(100, 100);
	this.map.updateInterface();
	this.map.setOnChange(function(file)
	{
		self.material.map = self.map.getValue();
		self.material.needsUpdate = true;
	});
	this.form.add(this.map);
	this.form.nextRow();

	this.form.updateInterface();
}

SpriteMaterialEditor.prototype = Object.create(MaterialEditor.prototype);

SpriteMaterialEditor.prototype.attachMaterial = function(material, material_file)
{
	MaterialEditor.prototype.attachMaterial.call(this, material, material_file);

	this.color.setValue(material.color.r, material.color.g, material.color.b);
	this.rotation.setValue(material.rotation);
	this.map.setValue(material.map);
}

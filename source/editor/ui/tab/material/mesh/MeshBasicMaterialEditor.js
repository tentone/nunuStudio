"use strict";

function MeshBasicMaterialEditor(parent, closeable, container, index)
{
	MeshMaterialEditor.call(this, parent, closeable, container, index);

	var self = this;

	//Skinning
	this.skinning = new CheckBox(this.form.element);
	this.form.addText("Skinning");
	this.skinning.size.set(15, 15);
	this.skinning.updateInterface();
	this.skinning.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.skinning = self.skinning.getValue();
		}
	});
	this.form.add(this.skinning);
	this.form.nextRow();

	//Morph targets
	this.morphTargets = new CheckBox(this.form.element);
	this.form.addText("Morph targets");
	this.morphTargets.size.set(15, 15);
	this.morphTargets.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.morphTargets = self.morphTargets.getValue();
		}
	});
	this.form.add(this.morphTargets);
	this.form.nextRow();

	//Wireframe
	this.wireframe = new CheckBox(this.form.element);
	this.form.addText("Wireframe");
	this.wireframe.size.set(15, 15);
	this.wireframe.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.wireframe = self.wireframe.getValue();
		}
	});
	this.form.add(this.wireframe);
	this.form.nextRow();

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

	//Texture map
	this.form.addText("Texture map");
	this.form.nextRow();
	this.map = new TextureBox(this.form.element);
	this.map.setOnChange(function(file)
	{
		self.material.map = self.map.getValue();
		self.material.needsUpdate = true;
	});
	this.form.add(this.map);
	this.form.nextRow();

	//Alpha map
	this.form.addText("Alpha map");
	this.form.nextRow();
	this.alphaMap = new TextureBox(this.form.element);
	this.alphaMap.setOnChange(function(file)
	{
		if(self.material !== null)
		{
			self.material.alphaMap = self.alphaMap.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.alphaMap);
	this.form.nextRow();
}

MeshBasicMaterialEditor.prototype = Object.create(MeshMaterialEditor.prototype);

MeshBasicMaterialEditor.prototype.attach = function(material, asset)
{
	MeshMaterialEditor.prototype.attach.call(this, material, asset);

	this.skinning.setValue(material.skinning);
	this.morphTargets.setValue(material.morphTargets);
	this.wireframe.setValue(material.wireframe);
	this.color.setValue(material.color.r, material.color.g, material.color.b);
	this.map.setValue(material.map);
	this.alphaMap.setValue(material.alphaMap);
};

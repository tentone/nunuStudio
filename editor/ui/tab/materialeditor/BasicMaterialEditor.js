"use strict";

function BasicMaterialEditor(parent)
{
	MaterialEditor.call(this, parent);

	var self = this;
	
	//Skinning
	this.form.addText("Animation");
	this.skinning = new CheckBox(this.preview.div_b);
	this.skinning.setText("Skinning");
	this.skinning.size.set(75, 15);
	this.skinning.updateInterface();
	this.skinning.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.skinning = self.skinning.getValue();
		}
	});
	this.form.add(this.skinning);

	//Morph targets
	this.morphTargets = new CheckBox(this.preview.div_b);
	this.morphTargets.setText("Morph targets");
	this.morphTargets.size.set(200, 15);
	this.morphTargets.updateInterface();
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
	this.wireframe.setText("Wireframe");
	this.wireframe.size.set(200, 15);
	this.wireframe.updateInterface();
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
	this.map.updateInterface();
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
	this.alphaMap.updateInterface();
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

	this.form.updateInterface();
}

BasicMaterialEditor.prototype = Object.create(MaterialEditor.prototype);

BasicMaterialEditor.prototype.attachMaterial = function(material, material_file)
{
	MaterialEditor.prototype.attachMaterial.call(this, material, material_file);

	this.skinning.setValue(material.skinning);
	this.morphTargets.setValue(material.morphTargets);
	this.wireframe.setValue(material.wireframe);
	this.color.setValue(material.color.r, material.color.g, material.color.b);
	this.map.setValue(material.map);
	this.alphaMap.setValue(material.alphaMap);
}

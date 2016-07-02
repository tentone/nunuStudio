function BasicMaterialEditor(parent)
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

	//Texture map
	this.form.addText("Texture map");
	this.form.nextRow();
	this.map = new Imagebox(this.form.element);
	this.map.size.set(100, 100);
	this.map.updateInterface();
	this.map.setOnChange(function(file)
	{
		self.material.map = new Texture(file);
		self.material.needsUpdate = true;
	});
	this.form.add(this.map);
	this.form.nextRow();

	//Alpha map
	this.form.addText("Alpha map");
	this.form.nextRow();
	this.alphaMap = new Imagebox(this.form.element);
	this.alphaMap.size.set(100, 100);
	this.alphaMap.updateInterface();
	this.alphaMap.setOnChange(function(file)
	{
		if(self.material !== null)
		{
			self.material.alphaMap = new Texture(file);
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.alphaMap);
	this.form.nextRow();

	this.form.updateInterface();
}

BasicMaterialEditor.prototype = Object.create(MaterialEditor.prototype);
BasicMaterialEditor.prototype.attachMaterial = attachMaterial;

function attachMaterial(material, material_file)
{
	MaterialEditor.prototype.attachMaterial.call(this, material, material_file);

	this.color.setValue(material.color.r, material.color.g, material.color.b);
	if(material.map !== null)
	{
		this.map.setImage(material.map.image.src);
	}
	if(material.alphaMap !== null)
	{
		this.alphaMap.setImage(material.alphaMap.image.src);
	}
}

"use strict";

function MeshBasicMaterialEditor(parent, closeable, container, index)
{
	MeshMaterialEditor.call(this, parent, closeable, container, index);

	var self = this;

	// Skinning
	this.skinning = new CheckBox(this.form);
	this.form.addText(Locale.skinning);
	this.skinning.size.set(0, 18);
	this.skinning.updateInterface();
	this.skinning.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "skinning", self.skinning.getValue()));
	});
	this.form.add(this.skinning);
	this.form.nextRow();

	// Morph targets
	this.morphTargets = new CheckBox(this.form);
	this.form.addText(Locale.morphTargets);
	this.morphTargets.size.set(0, 18);
	this.morphTargets.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "morphTargets", self.morphTargets.getValue()));
	});
	this.form.add(this.morphTargets);
	this.form.nextRow();

	// Wireframe
	this.wireframe = new CheckBox(this.form);
	this.form.addText(Locale.wireframe);
	this.wireframe.size.set(0, 18);
	this.wireframe.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "wireframe", self.wireframe.getValue()));
	});
	this.form.add(this.wireframe);
	this.form.nextRow();

	// Wireframe line cap
	this.form.addText(Locale.wireframeLinecap);
	this.wireframeLinecap = new DropdownList(this.form);
	this.wireframeLinecap.size.set(100, 18);
	this.wireframeLinecap.addValue("Butt", "butt");
	this.wireframeLinecap.addValue("Round", "round");
	this.wireframeLinecap.addValue("Square", "square");
	this.wireframeLinecap.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "wireframeLinecap", self.wireframeLinecap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.wireframeLinecap);
	this.form.nextRow();

	// Wireframe line cap
	this.form.addText(Locale.wireframeLinejoin);
	this.wireframeLinejoin = new DropdownList(this.form);
	this.wireframeLinejoin.size.set(100, 18);
	this.wireframeLinejoin.addValue("Bevel", "bevel");
	this.wireframeLinejoin.addValue("Round", "round");
	this.wireframeLinejoin.addValue("Miter", "miter");
	this.wireframeLinejoin.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "wireframeLinejoin", self.wireframeLinejoin.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.wireframeLinejoin);
	this.form.nextRow();

	// Wireframe line width
	this.form.addText(Locale.scale);
	this.wireframeLinewidth = new NumberBox(this.form);
	this.wireframeLinewidth.size.set(60, 18);
	this.wireframeLinewidth.setStep(0.1);
	this.wireframeLinewidth.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "wireframeLinewidth", self.wireframeLinewidth.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.wireframeLinewidth);
	this.form.nextRow();

	// Color
	this.form.addText(Locale.color);
	this.color = new ColorChooser(this.form);
	this.color.size.set(0, 18);
	this.color.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "color", new THREE.Color(self.color.getValueHex())));
		self.material.needsUpdate = true;
	});
	this.form.add(this.color);
	this.form.nextRow();

	// Texture map
	this.form.addText(Locale.textureMap);
	this.map = new TextureForm(this.form);
	this.map.size.set(0, 100);
	this.map.setOnChange(function(file)
	{
		Editor.addAction(new ChangeAction(self.material, "map", self.map.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.map);
	this.form.nextRow();

	// Alpha map
	this.form.addText(Locale.alphaMap);
	this.alphaMap = new TextureForm(this.form);
	this.alphaMap.size.set(0, 100);
	this.alphaMap.setOnChange(function(file)
	{
		Editor.addAction(new ChangeAction(self.material, "alphaMap", self.alphaMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.alphaMap);
	this.form.nextRow();

	// Specular map
	this.form.addText(Locale.specularMap);
	this.specularMap = new TextureForm(this.form);
	this.specularMap.size.set(0, 100);
	this.specularMap.setOnChange(function(file)
	{
		Editor.addAction(new ChangeAction(self.material, "specularMap", self.specularMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.specularMap);
	this.form.nextRow();
	
	// Ambient Occlusion map
	this.form.addText(Locale.ambientOcclusion);
	this.aoMap = new TextureForm(this.form);
	this.aoMap.size.set(0, 100);
	this.aoMap.setOnChange(function(file)
	{
		Editor.addAction(new ChangeAction(self.material, "aoMap", self.aoMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.aoMap);
	this.form.nextRow();

	// Ambient Occlusion
	this.form.addText(Locale.intensity);
	this.aoMapIntensity = new NumberBox(this.form);
	this.aoMapIntensity.size.set(60, 18);
	this.aoMapIntensity.setStep(0.05);
	this.aoMapIntensity.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "aoMapIntensity", self.aoMapIntensity.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.aoMapIntensity);
	this.form.nextRow();

	// Environment map
	this.form.addText(Locale.environmentMap);
	this.envMap = new CubeTextureBox(this.form);
	this.envMap.size.set(0, 100);
	this.envMap.setOnChange(function(file)
	{
		Editor.addAction(new ChangeAction(self.material, "envMap", self.envMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.envMap);
	this.form.nextRow();

	// Combine environment map
	this.form.addText(Locale.mode);
	this.combine = new DropdownList(this.form);
	this.combine.size.set(0, 18);
	this.combine.addValue(Locale.multiply, THREE.MultiplyOperation);
	this.combine.addValue(Locale.mix, THREE.MixOperation);
	this.combine.addValue(Locale.add, THREE.AddOperation);
	this.combine.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "combine", self.combine.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.combine);
	this.form.nextRow();

	// Reflectivity
	this.form.addText(Locale.reflectivity);
	this.reflectivity = new NumberBox(this.form);
	this.reflectivity.size.set(0, 18);
	this.reflectivity.setStep(0.05);
	this.reflectivity.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "reflectivity", self.reflectivity.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.reflectivity);
	this.form.nextRow();

	// Refraction
	this.form.addText(Locale.refractionRatio);
	this.refractionRatio = new NumberBox(this.form);
	this.refractionRatio.size.set(0, 18);
	this.refractionRatio.setStep(0.05);
	this.refractionRatio.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "refractionRatio", self.refractionRatio.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.refractionRatio);
}

MeshBasicMaterialEditor.prototype = Object.create(MeshMaterialEditor.prototype);

MeshBasicMaterialEditor.prototype.attach = function(material, asset)
{
	MeshMaterialEditor.prototype.attach.call(this, material, asset);

	this.skinning.setValue(material.skinning);
	this.morphTargets.setValue(material.morphTargets);
	this.wireframe.setValue(material.wireframe);
	this.wireframeLinecap.setValue(material.wireframeLinecap);
	this.wireframeLinejoin.setValue(material.wireframeLinejoin);
	this.wireframeLinewidth.setValue(material.wireframeLinewidth);
	this.color.setValue(material.color.r, material.color.g, material.color.b);
	this.map.setValue(material.map);
	this.alphaMap.setValue(material.alphaMap);
	this.specularMap.setValue(material.specularMap);
	this.aoMap.setValue(material.aoMap);
	this.aoMapIntensity.setValue(material.aoMapIntensity);
	this.envMap.setValue(material.envMap);
	this.combine.setValue(material.combine);
	this.reflectivity.setValue(material.reflectivity || 0);
	this.refractionRatio.setValue(material.refractionRatio || 0);
};

"use strict";

function MeshStandardMaterialEditor(parent, closeable, container, index)
{
	MeshMaterialEditor.call(this, parent, closeable, container, index);

	var self = this;

	// Roughness
	this.form.addText(Locale.roughness);
	this.roughness = new Slider(this.form);
	this.roughness.size.set(160, 18);
	this.roughness.setRange(0, 1);
	this.roughness.setStep(0.01);
	this.roughness.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "roughness", self.roughness.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.roughness);
	this.form.nextRow();

	// Shininess
	this.form.addText(Locale.metalness);
	this.metalness = new Slider(this.form);
	this.metalness.size.set(160, 18);
	this.metalness.setRange(0, 1);
	this.metalness.setStep(0.01);
	this.metalness.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "metalness", self.metalness.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.metalness);
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

	// Roughness map
	this.form.addText(Locale.roughnessMap);
	this.roughnessMap = new TextureForm(this.form);
	this.roughnessMap.size.set(0, 100);
	this.roughnessMap.setOnChange(function(file)
	{
		Editor.addAction(new ChangeAction(self.material, "roughnessMap", self.roughnessMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.roughnessMap);
	this.form.nextRow();

	// Metalness map
	this.form.addText(Locale.metalnessMap);
	this.metalnessMap = new TextureForm(this.form);
	this.metalnessMap.size.set(0, 100);
	this.metalnessMap.setOnChange(function(file)
	{
		Editor.addAction(new ChangeAction(self.material, "metalnessMap", self.metalnessMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.metalnessMap);
	this.form.nextRow();

	// Bump map
	this.form.addText(Locale.bumpMap);
	this.bumpMap = new TextureForm(this.form);
	this.bumpMap.size.set(0, 100);
	this.bumpMap.setOnChange(function(file)
	{
		Editor.addAction(new ChangeAction(self.material, "bumpMap", self.bumpMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.bumpMap);
	this.form.nextRow();

	// Bump map scale
	this.form.addText(Locale.bumpScale);
	this.bumpScale = new Slider(this.form);
	this.bumpScale.size.set(160, 18);
	this.bumpScale.setRange(0, 1);
	this.bumpScale.setStep(0.01);
	this.bumpScale.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "bumpScale", self.bumpScale.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.bumpScale);
	this.form.nextRow();

	// Normal map
	this.form.addText(Locale.normalMap);
	this.normalMap = new TextureForm(this.form);
	this.normalMap.size.set(0, 100);
	this.normalMap.setOnChange(function(file)
	{
		Editor.addAction(new ChangeAction(self.material, "normalMap", self.normalMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.normalMap);
	this.form.nextRow();

	// Normal map scale
	this.form.addText(Locale.normalScale);
	this.normalScale = new VectorBox(this.form);
	this.normalScale.size.set(0, 18);
	this.normalScale.setType(VectorBox.VECTOR2);
	this.normalScale.setValue(1, 1, 0);
	this.normalScale.setOnChange(function()
	{
		self.material.normalScale.copy(self.normalScale.getValue());
		self.material.needsUpdate = true;
	});
	this.form.add(this.normalScale);
	this.form.nextRow();

	// Normal type
	this.form.addText(Locale.normalType);
	this.normalMapType = new DropdownList(this.form);
	this.normalMapType.size.set(100, 18);
	this.normalMapType.addValue(Locale.tangentSpace, THREE.TangentSpaceNormalMap);
	this.normalMapType.addValue(Locale.objectSpace, THREE.ObjectSpaceNormalMap);
	this.normalMapType.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "normalMapType", self.normalMapType.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.normalMapType);
	this.form.nextRow();

	// Displacement map
	this.form.addText(Locale.displacementMap);
	this.displacementMap = new TextureForm(this.form);
	this.displacementMap.size.set(0, 100);
	this.displacementMap.setOnChange(function(file)
	{
		Editor.addAction(new ChangeAction(self.material, "displacementMap", self.displacementMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.displacementMap);
	this.form.nextRow();

	// Displacement map scale
	this.form.addText(Locale.scale);
	this.displacementScale = new NumberBox(this.form);
	this.displacementScale.size.set(60, 18);
	this.displacementScale.setStep(0.05);
	this.displacementScale.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "displacementScale", self.displacementScale.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.displacementScale);
	this.form.nextRow();

	// Displacement map bias
	this.form.addText(Locale.bias);
	this.displacementBias = new NumberBox(this.form);
	this.displacementBias.size.set(60, 18);
	this.displacementBias.setStep(0.1);
	this.displacementBias.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "displacementBias", self.displacementBias.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.displacementBias);
	this.form.nextRow();

	// Emissive map
	this.form.addText(Locale.emissiveMap);
	this.emissiveMap = new TextureForm(this.form);
	this.emissiveMap.size.set(0, 100);
	this.emissiveMap.setOnChange(function(file)
	{
		Editor.addAction(new ChangeAction(self.material, "emissiveMap", self.emissiveMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.emissiveMap);
	this.form.nextRow();

	// Emissive color
	this.form.addText(Locale.color);
	this.emissive = new ColorChooser(this.form);
	this.emissive.size.set(100, 18);
	this.emissive.setOnChange(function()
	{
		self.material.emissive.setHex(self.emissive.getValueHex());
		self.material.needsUpdate = true;
	});
	this.form.add(this.emissive);
	this.form.nextRow();

	// Emissive intensity
	this.form.addText(Locale.intensity);
	this.emissiveIntensity = new NumberBox(this.form);
	this.emissiveIntensity.size.set(60, 18);
	this.emissiveIntensity.setStep(0.1);
	this.emissiveIntensity.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "emissiveIntensity", self.emissiveIntensity.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.emissiveIntensity);
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

	// Reflectivity
	this.form.addText(Locale.intensity);
	this.envMapIntensity = new NumberBox(this.form);
	this.envMapIntensity.size.set(60, 18);
	this.envMapIntensity.setStep(0.05);
	this.envMapIntensity.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "envMapIntensity", self.envMapIntensity.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.envMapIntensity);
	this.form.nextRow();

	// Reflectivity
	this.form.addText(Locale.refraction);
	this.refractionRatio = new NumberBox(this.form);
	this.refractionRatio.size.set(60, 18);
	this.refractionRatio.setStep(0.05);
	this.refractionRatio.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "refractionRatio", self.refractionRatio.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.refractionRatio);
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
}

MeshStandardMaterialEditor.prototype = Object.create(MeshMaterialEditor.prototype);

MeshStandardMaterialEditor.prototype.attach = function(material, asset)
{
	MeshMaterialEditor.prototype.attach.call(this, material, asset);

	this.roughness.setValue(material.roughness);
	this.metalness.setValue(material.metalness);
	this.map.setValue(material.map);
	this.roughnessMap.setValue(material.roughnessMap);
	this.metalnessMap.setValue(material.metalnessMap);
	this.bumpMap.setValue(material.bumpMap);
	this.bumpScale.setValue(material.bumpScale);
	this.normalMap.setValue(material.normalMap);
	this.normalScale.setValue(material.normalScale.x, material.normalScale.y);
	this.normalMapType.setValue(material.normalMapType);
	this.displacementMap.setValue(material.displacementMap);
	this.displacementScale.setValue(material.displacementScale);
	this.displacementBias.setValue(material.displacementBias);
	this.emissive.setValue(material.emissive.r, material.emissive.g, material.emissive.b);
	this.emissiveIntensity.setValue(material.emissiveIntensity);
	this.emissiveMap.setValue(material.emissiveMap);
	this.alphaMap.setValue(material.alphaMap);
	this.envMap.setValue(material.envMap);
	this.envMapIntensity.setValue(material.envMapIntensity);
	this.refractionRatio.setValue(material.refractionRatio);
	this.aoMap.setValue(material.aoMap);
	this.aoMapIntensity.setValue(material.aoMapIntensity);
};

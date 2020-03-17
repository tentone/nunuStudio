"use strict";

function MeshMatcapMaterialEditor(parent, closeable, container, index)
{
	MeshMaterialEditor.call(this, parent, closeable, container, index);

	var self = this;

	// Skinning
	this.skinning = new CheckBox(this.form);
	this.form.addText(Locale.skinning);
	this.skinning.size.set(18, 18);
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
	this.morphTargets.size.set(18, 18);
	this.morphTargets.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "morphTargets", self.morphTargets.getValue()));
	});
	this.form.add(this.morphTargets);
	this.form.nextRow();

	// Wireframe
	this.wireframe = new CheckBox(this.form);
	this.form.addText(Locale.wireframe);
	this.wireframe.size.set(18, 18);
	this.wireframe.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "wireframe", self.wireframe.getValue()));
	});
	this.form.add(this.wireframe);
	this.form.nextRow();

	// Color
	this.form.addText(Locale.color);
	this.color = new ColorChooser(this.form);
	this.color.size.set(100, 18);
	this.color.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.material, "color", new THREE.Color(self.color.getValueHex())));
		self.material.needsUpdate = true;
	});
	this.form.add(this.color);
	this.form.nextRow();

	// Matcap map
	this.form.addText("Matcap map");
	this.matcap = new TextureForm(this.form);
	this.matcap.size.set(0, 100);
	this.matcap.setOnChange(function(file)
	{
		Editor.addAction(new ChangeAction(self.material, "matcap", self.matcap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.matcap);
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

	// Bump scale
	this.form.addText(Locale.scale);
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
	this.normalScale.setType(VectorBox.VECTOR2);
	this.normalScale.setValue(1, 1, 0);
	this.normalScale.size.set(0, 18);
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
}

MeshMatcapMaterialEditor.prototype = Object.create(MeshMaterialEditor.prototype);

MeshMatcapMaterialEditor.prototype.attach = function(material, asset)
{
	MeshMaterialEditor.prototype.attach.call(this, material, asset);

	this.skinning.setValue(material.skinning);
	this.morphTargets.setValue(material.morphTargets);
	this.wireframe.setValue(material.wireframe);
	this.color.setValue(material.color.r, material.color.g, material.color.b);
	this.matcap.setValue(material.matcap);
	this.map.setValue(material.map);
	this.bumpMap.setValue(material.bumpMap);
	this.bumpScale.setValue(material.bumpScale);
	this.normalMap.setValue(material.normalMap);
	this.normalScale.setValue(material.normalScale.x, material.normalScale.y);
	this.normalMapType.setValue(material.normalMapType);
	this.displacementMap.setValue(material.displacementMap);
	this.displacementScale.setValue(material.displacementScale);
	this.displacementBias.setValue(material.displacementBias);
	this.alphaMap.setValue(material.alphaMap);
};

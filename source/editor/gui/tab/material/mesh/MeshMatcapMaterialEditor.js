"use strict";

function MeshMatcapMaterialEditor(parent, closeable, container, index)
{
	MeshMaterialEditor.call(this, parent, closeable, container, index);

	var self = this;

	//Skinning
	this.skinning = new CheckBox(this.form);
	this.form.addText("Skinning");
	this.skinning.size.set(18, 18);
	this.skinning.updateInterface();
	this.skinning.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "skinning", self.skinning.getValue()));
	});
	this.form.add(this.skinning);
	this.form.nextRow();

	//Morph targets
	this.morphTargets = new CheckBox(this.form);
	this.form.addText("Morph targets");
	this.morphTargets.size.set(18, 18);
	this.morphTargets.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "morphTargets", self.morphTargets.getValue()));
	});
	this.form.add(this.morphTargets);
	this.form.nextRow();

	//Wireframe
	this.wireframe = new CheckBox(this.form);
	this.form.addText("Wireframe");
	this.wireframe.size.set(18, 18);
	this.wireframe.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "wireframe", self.wireframe.getValue()));
	});
	this.form.add(this.wireframe);
	this.form.nextRow();

	//Color
	this.form.addText("Color");
	this.color = new ColorChooser(this.form);
	this.color.size.set(100, 18);
	this.color.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "color", new THREE.Color(self.color.getValueHex())));
		self.material.needsUpdate = true;
	});
	this.form.add(this.color);
	this.form.nextRow();

	//Matcap map
	this.form.addText("Matcap map");
	this.form.nextRow();
	this.matcap = new TextureForm(this.form);
	this.matcap.setOnChange(function(file)
	{
		Editor.history.add(new ChangeAction(self.material, "matcap", self.matcap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.matcap);
	this.form.nextRow();

	//Texture map
	this.form.addText("Texture map");
	this.form.nextRow();
	this.map = new TextureForm(this.form);
	this.map.setOnChange(function(file)
	{
		Editor.history.add(new ChangeAction(self.material, "map", self.map.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.map);
	this.form.nextRow();

	//Bump map
	this.form.addText("Bump map");
	this.form.nextRow();
	this.bumpMap = new TextureForm(this.form);
	this.bumpMap.setOnChange(function(file)
	{
		Editor.history.add(new ChangeAction(self.material, "bumpMap", self.bumpMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.bumpMap);
	this.form.nextRow();

	//Bump scale
	this.form.addText("Scale");
	this.bumpScale = new Slider(this.form);
	this.bumpScale.size.set(160, 18);
	this.bumpScale.setRange(0, 1);
	this.bumpScale.setStep(0.01);
	this.bumpScale.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "bumpScale", self.bumpScale.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.bumpScale);
	this.form.nextRow();

	//Normal map
	this.form.addText("Normal map");
	this.form.nextRow();
	this.normalMap = new TextureForm(this.form);
	this.normalMap.setOnChange(function(file)
	{
		Editor.history.add(new ChangeAction(self.material, "normalMap", self.normalMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.normalMap);
	this.form.nextRow();

	//Normal map scale
	this.form.addText("Normal scale");
	this.normalScale = new VectorBox(this.form);
	this.normalScale.setType(VectorBox.VECTOR2);
	this.normalScale.setValue(1, 1, 0);
	this.normalScale.setOnChange(function()
	{
		self.material.normalScale.copy(self.normalScale.getValue());
		self.material.needsUpdate = true;
	});
	this.form.add(this.normalScale);
	this.form.nextRow();

	//Normal type
	this.form.addText("Normal type");
	this.normalMapType = new DropdownList(this.form);
	this.normalMapType.size.set(100, 18);
	this.normalMapType.addValue("Tangent Space", THREE.TangentSpaceNormalMap);
	this.normalMapType.addValue("Object Space", THREE.ObjectSpaceNormalMap);
	this.normalMapType.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "normalMapType", self.normalMapType.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.normalMapType);
	this.form.nextRow();

	//Displacement map
	this.form.addText("Displacement Map");
	this.form.nextRow();
	this.displacementMap = new TextureForm(this.form);
	this.displacementMap.setOnChange(function(file)
	{
		Editor.history.add(new ChangeAction(self.material, "displacementMap", self.displacementMap.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.displacementMap);
	this.form.nextRow();

	//Displacement map scale
	this.form.addText("Scale");
	this.displacementScale = new NumberBox(this.form);
	this.displacementScale.size.set(60, 18);
	this.displacementScale.setStep(0.05);
	this.displacementScale.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "displacementScale", self.displacementScale.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.displacementScale);
	this.form.nextRow();

	//Displacement map bias
	this.form.addText("Bias");
	this.displacementBias = new NumberBox(this.form);
	this.displacementBias.size.set(60, 18);
	this.displacementBias.setStep(0.1);
	this.displacementBias.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "displacementBias", self.displacementBias.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.displacementBias);
	this.form.nextRow();

	//Alpha map
	this.form.addText("Alpha map");
	this.form.nextRow();
	this.alphaMap = new TextureForm(this.form);
	this.alphaMap.setOnChange(function(file)
	{
		Editor.history.add(new ChangeAction(self.material, "alphaMap", self.alphaMap.getValue()));
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

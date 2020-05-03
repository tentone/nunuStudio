"use strict";

function MeshMaterialEditor(parent, closeable, container, index)
{
	MaterialEditor.call(this, parent, closeable, container, index);
	
	var self = this;

	// Preview scene
	this.sky = new Sky();
	this.scene.add(this.sky);

	this.pointLight = new THREE.PointLight(0x666666);
	this.pointLight.position.set(-1, 0, 3);
	this.scene.add(this.pointLight);
	
	this.ambientLight = new THREE.AmbientLight(0x555555);
	this.ambientLight.visible = false;
	this.scene.add(this.ambientLight);

	// Mesh
	this.mesh = new THREE.Mesh(MaterialEditor.geometries[0][1], null);
	this.interactive.add(this.mesh);
	
	// Test model
	this.previewForm.addText(Locale.geometry);
	this.testModel = new DropdownList(this.previewForm);
	this.testModel.size.set(100, 18);
	for(var i = 0; i < MaterialEditor.geometries.length; i++)
	{
		this.testModel.addValue(MaterialEditor.geometries[i][0], i);
	}
	this.testModel.setOnChange(function()
	{
		var value = self.testModel.getSelectedIndex();
		self.mesh.geometry = MaterialEditor.geometries[value][1];
	});
	this.previewForm.add(this.testModel);
	this.previewForm.nextRow();

	// Sky
	this.previewForm.addText(Locale.sky);
	this.skyEnabled = new CheckBox(this.previewForm);
	this.skyEnabled.size.set(18, 18);
	this.skyEnabled.setValue(this.sky.visible);
	this.skyEnabled.setOnChange(function()
	{
		self.sky.visible = self.skyEnabled.getValue();
	});
	this.previewForm.add(this.skyEnabled);
	this.previewForm.nextRow();

	// Point Light
	this.previewForm.addText(Locale.pointLight);
	this.previewForm.nextRow();

	this.previewForm.addText(Locale.enabled);
	this.lightEnabled = new CheckBox(this.previewForm);
	this.lightEnabled.size.set(18, 18);
	this.lightEnabled.setValue(this.pointLight.visible);
	this.lightEnabled.setOnChange(function()
	{
		self.pointLight.visible = self.lightEnabled.getValue();
	});
	this.previewForm.add(this.lightEnabled);
	this.previewForm.nextRow();

	this.previewForm.addText(Locale.color);
	this.pointLightColor = new ColorChooser(this.previewForm);
	this.pointLightColor.size.set(80, 18);
	this.pointLightColor.setOnChange(function()
	{
		self.pointLight.color.setHex(self.pointLightColor.getValueHex());
	});
	this.previewForm.add(this.pointLightColor);
	this.previewForm.nextRow();

	// Ambient Light
	this.previewForm.addText(Locale.ambientLight);
	this.previewForm.nextRow();

	this.previewForm.addText(Locale.enabled);
	this.ambientLightEnabled = new CheckBox(this.previewForm);
	this.ambientLightEnabled.size.set(18, 18);
	this.ambientLightEnabled.setValue(this.ambientLight.visible);
	this.ambientLightEnabled.setOnChange(function()
	{
		self.ambientLight.visible = self.ambientLightEnabled.getValue();
	});
	this.previewForm.add(this.ambientLightEnabled);
	this.previewForm.nextRow();

	this.previewForm.addText(Locale.color);
	this.ambientLightColor = new ColorChooser(this.previewForm);
	this.ambientLightColor.size.set(80, 18);
	this.ambientLightColor.setOnChange(function()
	{
		self.ambientLight.color.setHex(self.ambientLightColor.getValueHex());
	});
	this.previewForm.add(this.ambientLightColor);
	this.previewForm.nextRow();
}

MeshMaterialEditor.prototype = Object.create(MaterialEditor.prototype)

MeshMaterialEditor.prototype.attach = function(material, asset)
{
	MaterialEditor.prototype.attach.call(this, material, asset);

	this.sky.visible = material.envMap === null;
	this.mesh.material = material;
};

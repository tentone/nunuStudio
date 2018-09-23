"use strict";

function SpriteMaterialEditor(parent, closeable, container, index)
{
	MaterialEditor.call(this, parent, closeable, container, index);

	var self = this;

	//Preview scene
	this.sky = new Sky();
	this.sky.visible = false;
	this.scene.add(this.sky);

	this.camera.position.set(0, 0, 1.5);
	
	this.sprite = new THREE.Sprite(null);
	this.interactive.add(this.sprite);

	//Sky
	this.previewForm.addText("Sky");
	this.skyEnabled = new CheckBox(this.previewForm);
	this.skyEnabled.size.set(15, 15);
	this.skyEnabled.setValue(this.sky.visible);
	this.skyEnabled.setOnChange(function()
	{
		self.sky.visible = self.skyEnabled.getValue();
	});
	this.previewForm.add(this.skyEnabled);
	this.previewForm.nextRow();
	
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

	//Rotation
	this.form.addText("Rotation");
	this.rotation = new NumberBox(this.form);
	this.rotation.size.set(60, 18);
	this.rotation.setStep(0.01);
	this.rotation.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "rotation", self.rotation.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.rotation);
	this.form.nextRow();

	//Texture map
	this.form.addText("Texture map");
	this.form.nextRow();
	this.map = new TextureBox(this.form);
	this.map.size.set(100, 100);
	this.map.setOnChange(function(file)
	{
		Editor.history.add(new ChangeAction(self.material, "map", self.map.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.map);
	this.form.nextRow();
}

SpriteMaterialEditor.prototype = Object.create(MaterialEditor.prototype);

SpriteMaterialEditor.prototype.attach = function(material, asset)
{
	MaterialEditor.prototype.attach.call(this, material, asset);

	this.sprite.material = material;

	this.color.setValue(material.color.r, material.color.g, material.color.b);
	this.rotation.setValue(material.rotation);
	this.map.setValue(material.map);
};

"use strict";

function TexturePanel(parent, object)
{
	Panel.call(this, parent, object);

	var self = this;

	//Name
	this.form.addText("Name");
	this.name = new TextBox(this.form);
	this.name.size.set(190, 18);
	this.name.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "name", self.name.getText()));
		Editor.updateObjectsViewsGUI();
	});
	this.form.add(this.name);
	this.form.nextRow();

	//UUID
	if(Editor.settings.general.showUUID)
	{
		this.form.addText("UUID");
		this.uuid = this.form.addText("");
		this.form.nextRow();
	}

	//WrapS
	this.form.addText("Wrap Hor.");
	this.wrapS = new DropdownList(this.form);
	this.wrapS.size.set(120, 18);
	this.wrapS.addValue("Clamp to Edge", THREE.ClampToEdgeWrapping);
	this.wrapS.addValue("Repeat", THREE.RepeatWrapping);
	this.wrapS.addValue("Repeat Mirrored", THREE.MirroredRepeatWrapping);
	this.wrapS.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "wrapS", self.wrapS.getValue()));
	});
	this.form.add(this.wrapS);
	this.form.nextRow();

	//WrapT
	this.form.addText("Wrap Vert.");
	this.wrapT = new DropdownList(this.form);
	this.wrapT.size.set(120, 18);
	this.wrapT.addValue("Clamp to Edge", THREE.ClampToEdgeWrapping);
	this.wrapT.addValue("Repeat", THREE.RepeatWrapping);
	this.wrapT.addValue("Repeat Mirrored", THREE.MirroredRepeatWrapping);
	this.wrapT.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "wrapT", self.wrapT.getValue()));
	});
	this.form.add(this.wrapT);
	this.form.nextRow();

	//Repeat
	this.form.addText("Repeat");
	this.repeat = new VectorBox(this.form);
	this.repeat.setType(VectorBox.VECTOR2);
	this.repeat.size.set(120, 18);
	this.repeat.setStep(0.01);
	this.repeat.setOnChange(function()
	{
		var value = self.repeat.getValue();
		self.object.repeat.set(value.x, value.y);
	});
	this.form.add(this.repeat);
	this.form.nextRow();

	//Offset
	this.form.addText("Offset");
	this.offset = new VectorBox(this.form);
	this.offset.setType(VectorBox.VECTOR2);
	this.offset.size.set(120, 18);
	this.offset.setStep(0.01);
	this.offset.setOnChange(function()
	{
		var value = self.offset.getValue();
		self.object.offset.set(value.x, value.y);
	});
	this.form.add(this.offset);
	this.form.nextRow();

	//Center
	this.form.addText("Center");
	this.center = new VectorBox(this.form);
	this.center.setType(VectorBox.VECTOR2);
	this.center.size.set(120, 18);
	this.center.setStep(0.01);
	this.center.setOnChange(function()
	{
		var value = self.center.getValue();
		self.object.center.set(value.x, value.y);
	});
	this.form.add(this.center);
	this.form.nextRow();

	//Rotation
	this.form.addText("Rotation");
	this.rotation = new NumberBox(this.form);
	this.rotation.size.set(60, 18);
	this.rotation.setStep(0.1);
	this.rotation.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "rotation", self.rotation.getValue()));
	});
	this.form.add(this.rotation);
	this.form.nextRow();

	//Minification filter
	this.form.addText("Min. filter");
	this.minFilter = new DropdownList(this.form);
	this.minFilter.size.set(150, 18);
	this.minFilter.addValue("Nearest", THREE.NearestFilter);
	this.minFilter.addValue("Linear", THREE.LinearFilter);
	this.minFilter.addValue("MIP Nearest Nearest", THREE.NearestMipMapNearestFilter);
	this.minFilter.addValue("MIP Nearest Linear", THREE.NearestMipMapLinearFilter);
	this.minFilter.addValue("MIP Linear Nearest", THREE.LinearMipMapNearestFilter);
	this.minFilter.addValue("MIP Linear Linear", THREE.LinearMipMapLinearFilter);
	this.minFilter.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "minFilter", self.minFilter.getValue()));
	});
	this.form.add(this.minFilter);
	this.form.nextRow();

	//Magnification filter
	this.form.addText("Mag. filter");
	this.magFilter = new DropdownList(this.form);
	this.magFilter.size.set(150, 18);
	this.magFilter.addValue("Nearest", THREE.NearestFilter);
	this.magFilter.addValue("Linear", THREE.LinearFilter);
	this.magFilter.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "magFilter", self.magFilter.getValue()));
	});
	this.form.add(this.magFilter);
	this.form.nextRow();

	//Premultiply Alpha
	this.form.addText("Premul. Alpha");
	this.premultiplyAlpha = new CheckBox(this.form);
	this.premultiplyAlpha.size.set(18, 18);
	this.premultiplyAlpha.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "premultiplyAlpha", self.premultiplyAlpha.getValue()));
	});
	this.form.add(this.premultiplyAlpha);
	this.form.nextRow();

	//Flip Y
	this.form.addText("Flip Y");
	this.flipY = new CheckBox(this.form);
	this.flipY.size.set(18, 18);
	this.flipY.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "flipY", self.flipY.getValue()));
	});
	this.form.add(this.flipY);
	this.form.nextRow();
}

TexturePanel.prototype = Object.create(Panel.prototype);

TexturePanel.prototype.updatePanel = function()
{
	this.name.setText(this.object.name);
		
	if(this.uuid !== undefined)
	{
		this.uuid.setText(this.object.uuid);
	}

	this.wrapT.setValue(this.object.wrapT);
	this.wrapS.setValue(this.object.wrapS);
	this.repeat.setValue(this.object.repeat);
	this.offset.setValue(this.object.offset);
	this.center.setValue(this.object.center);
	this.rotation.setValue(this.object.rotation);
	this.magFilter.setValue(this.object.magFilter);
	this.minFilter.setValue(this.object.minFilter);
	this.premultiplyAlpha.setValue(this.object.premultiplyAlpha);
	this.flipY.setValue(this.object.flipY);
};

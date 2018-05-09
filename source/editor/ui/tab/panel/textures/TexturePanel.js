"use strict";

function TexturePanel(parent, obj)
{
	Panel.call(this, parent, obj);

	var self = this;

	//Name
	this.form.addText("Name");
	this.name = new TextBox(this.form.element);
	this.name.size.set(190, 18);
	this.name.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "name", self.name.getText()));
		Editor.updateObjectsViews();
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
	this.wrapS = new DropdownList(this.form.element);
	this.wrapS.size.set(120, 18);
	this.wrapS.addValue("Clamp to Edge", THREE.ClampToEdgeWrapping);
	this.wrapS.addValue("Repeat", THREE.RepeatWrapping);
	this.wrapS.addValue("Repeat Mirrored", THREE.MirroredRepeatWrapping);
	this.wrapS.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "wrapS", self.wrapS.getValue()));
	});
	this.form.add(this.wrapS);
	this.form.nextRow();

	//WrapT
	this.form.addText("Wrap Vert.");
	this.wrapT = new DropdownList(this.form.element);
	this.wrapT.size.set(120, 18);
	this.wrapT.addValue("Clamp to Edge", THREE.ClampToEdgeWrapping);
	this.wrapT.addValue("Repeat", THREE.RepeatWrapping);
	this.wrapT.addValue("Repeat Mirrored", THREE.MirroredRepeatWrapping);
	this.wrapT.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "wrapT", self.wrapT.getValue()));
	});
	this.form.add(this.wrapT);
	this.form.nextRow();

	//Repeat
	this.form.addText("Repeat");
	this.repeat = new CoordinatesBox(this.form.element);
	this.repeat.setMode(CoordinatesBox.VECTOR2);
	this.repeat.size.set(120, 18);
	this.repeat.setStep(0.01);
	this.repeat.setOnChange(function()
	{
		var value = self.repeat.getValue();
		self.obj.repeat.set(value.x, value.y);
	});
	this.form.add(this.repeat);
	this.form.nextRow();

	//Offset
	this.form.addText("Offset");
	this.offset = new CoordinatesBox(this.form.element);
	this.offset.setMode(CoordinatesBox.VECTOR2);
	this.offset.size.set(120, 18);
	this.offset.setStep(0.01);
	this.offset.setOnChange(function()
	{
		var value = self.offset.getValue();
		self.obj.offset.set(value.x, value.y);
	});
	this.form.add(this.offset);
	this.form.nextRow();

	//Center
	this.form.addText("Center");
	this.center = new CoordinatesBox(this.form.element);
	this.center.setMode(CoordinatesBox.VECTOR2);
	this.center.size.set(120, 18);
	this.center.setStep(0.01);
	this.center.setOnChange(function()
	{
		var value = self.center.getValue();
		self.obj.center.set(value.x, value.y);
	});
	this.form.add(this.center);
	this.form.nextRow();

	//Rotation
	this.form.addText("Rotation");
	this.rotation = new NumberBox(this.form.element);
	this.rotation.size.set(60, 18);
	this.rotation.setStep(0.1);
	this.rotation.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "rotation", self.rotation.getValue()));
	});
	this.form.add(this.rotation);
	this.form.nextRow();

	//Minification filter
	this.form.addText("Min. filter");
	this.minFilter = new DropdownList(this.form.element);
	this.minFilter.size.set(150, 18);
	this.minFilter.addValue("Nearest", THREE.NearestFilter);
	this.minFilter.addValue("Linear", THREE.LinearFilter);
	this.minFilter.addValue("MIP Nearest Nearest", THREE.NearestMipMapNearestFilter);
	this.minFilter.addValue("MIP Nearest Linear", THREE.NearestMipMapLinearFilter);
	this.minFilter.addValue("MIP Linear Nearest", THREE.LinearMipMapNearestFilter);
	this.minFilter.addValue("MIP Linear Linear", THREE.LinearMipMapLinearFilter);
	this.minFilter.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "minFilter", self.minFilter.getValue()));
	});
	this.form.add(this.minFilter);
	this.form.nextRow();

	//Magnification filter
	this.form.addText("Mag. filter");
	this.magFilter = new DropdownList(this.form.element);
	this.magFilter.size.set(150, 18);
	this.magFilter.addValue("Nearest", THREE.NearestFilter);
	this.magFilter.addValue("Linear", THREE.LinearFilter);
	this.magFilter.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "magFilter", self.magFilter.getValue()));
	});
	this.form.add(this.magFilter);
	this.form.nextRow();

	//Premultiply Alpha
	this.form.addText("Premul. Alpha");
	this.premultiplyAlpha = new CheckBox(this.form.element);
	this.premultiplyAlpha.size.set(15, 15);
	this.premultiplyAlpha.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "premultiplyAlpha", self.premultiplyAlpha.getValue()));
	});
	this.form.add(this.premultiplyAlpha);
	this.form.nextRow();

	//Flip Y
	this.form.addText("Flip Y");
	this.flipY = new CheckBox(this.form.element);
	this.flipY.size.set(15, 15);
	this.flipY.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "flipY", self.flipY.getValue()));
	});
	this.form.add(this.flipY);
	this.form.nextRow();
}

TexturePanel.prototype = Object.create(Panel.prototype);

TexturePanel.prototype.updatePanel = function()
{
	this.name.setText(this.obj.name);
		
	if(this.uuid !== undefined)
	{
		this.uuid.setText(this.obj.uuid);
	}

	this.wrapT.setValue(this.obj.wrapT);
	this.wrapS.setValue(this.obj.wrapS);
	this.repeat.setValue(this.obj.repeat);
	this.offset.setValue(this.obj.offset);
	this.center.setValue(this.obj.center);
	this.rotation.setValue(this.obj.rotation);
	this.magFilter.setValue(this.obj.magFilter);
	this.minFilter.setValue(this.obj.minFilter);
	this.premultiplyAlpha.setValue(this.obj.premultiplyAlpha);
	this.flipY.setValue(this.obj.flipY);
};

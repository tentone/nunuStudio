"use strict";

function DirectionalLightPanel(parent, object)
{
	ObjectPanel.call(this, parent, object);

	var self = this;

	//Color
	this.form.addText("Color");
	this.color = new ColorChooser(this.form);
	this.color.size.set(80, 18);
	this.color.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object, "color", new THREE.Color(self.color.getValueHex())));
	});
	this.form.add(this.color);
	this.form.nextRow();

	//Shadow map
	this.form.addText("Shadows");
	this.form.nextRow();

	//Cast shadow
	this.castShadow = new CheckBox(this.form);
	this.form.addText("Cast Shadows");
	this.castShadow.size.set(18, 18);
	this.castShadow.position.set(5, 85);
	this.castShadow.updateInterface();
	this.castShadow.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object, "castShadow", self.castShadow.getValue()));
	});
	this.form.add(this.castShadow);
	this.form.nextRow();

	//Shadow resolution
	this.form.addText("Resolution");
	this.shadowWidth = new DropdownList(this.form);
	this.shadowWidth.size.set(60, 18);
	this.shadowWidth.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object.shadow.mapSize, "width", self.shadowWidth.getValue()));
		self.object.updateShadowMap();
	});
	this.form.add(this.shadowWidth);
	this.form.addText("x", true);
	this.shadowHeight = new DropdownList(this.form);
	this.shadowHeight.size.set(60, 18);
	this.shadowHeight.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object.shadow.mapSize, "height", self.shadowHeight.getValue()));
		self.object.updateShadowMap();
	});

	this.form.add(this.shadowHeight);
	this.form.nextRow();
	for(var i = 5; i < 13; i++)
	{
		var size = Math.pow(2, i);
		this.shadowWidth.addValue(size.toString(), size);
		this.shadowHeight.addValue(size.toString(), size);
	}

	//Shadowmap camera near
	this.form.addText("Near");
	this.shadowNear = new NumberBox(this.form);
	this.shadowNear.size.set(60, 18);
	this.shadowNear.setStep(0.1);
	this.shadowNear.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object.shadow.camera, "near", self.shadowNear.getValue()));
		self.object.updateShadowMap();
	});
	this.form.add(this.shadowNear);
	this.form.nextRow();
	
	//Shadowmap camera far
	this.form.addText("Far");
	this.shadowFar = new NumberBox(this.form);
	this.shadowFar.size.set(60, 18);
	this.shadowFar.setStep(0.1);
	this.shadowFar.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object.shadow.camera, "far", self.shadowFar.getValue()));
		self.object.updateShadowMap();
	});
	this.form.add(this.shadowFar);
	this.form.nextRow();

	//Shadowmap camera left
	this.form.addText("Left");
	this.shadowLeft = new NumberBox(this.form);
	this.shadowLeft.size.set(60, 18);
	this.shadowLeft.setStep(0.1);
	this.shadowLeft.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object.shadow.camera, "left", self.shadowLeft.getValue()));
		self.object.updateShadowMap();
	});
	this.form.add(this.shadowLeft);
	this.form.nextRow();

	//Shadowmap camera right
	this.form.addText("Right");
	this.shadowRight = new NumberBox(this.form);
	this.shadowRight.size.set(60, 18);
	this.shadowRight.setStep(0.1);
	this.shadowRight.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object.shadow.camera, "right", self.shadowRight.getValue()));
		self.object.updateShadowMap();
	});
	this.form.add(this.shadowRight);
	this.form.nextRow();

	//Shadowmap camera top
	this.form.addText("Top");
	this.shadowTop = new NumberBox(this.form);
	this.shadowTop.size.set(60, 18);
	this.shadowTop.setStep(0.1);
	this.shadowTop.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object.shadow.camera, "top", self.shadowTop.getValue()));
		self.object.updateShadowMap();
	});
	this.form.add(this.shadowTop);
	this.form.nextRow();

	//Shadowmap camera bottom
	this.form.addText("Bottom");
	this.shadowBottom = new NumberBox(this.form);
	this.shadowBottom.size.set(60, 18);
	this.shadowBottom.setStep(0.1);
	this.shadowBottom.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.object.shadow.camera, "bottom", self.shadowBottom.getValue()));
		self.object.updateShadowMap();
	});
	this.form.add(this.shadowBottom);
	this.form.nextRow();

}

DirectionalLightPanel.prototype = Object.create(ObjectPanel.prototype);

DirectionalLightPanel.prototype.updatePanel = function()
{
	ObjectPanel.prototype.updatePanel.call(this);
	
	this.color.setValue(this.object.color.r, this.object.color.g, this.object.color.b);
	this.castShadow.setValue(this.object.castShadow);
	this.shadowWidth.setValue(this.object.shadow.mapSize.width);
	this.shadowHeight.setValue(this.object.shadow.mapSize.height);
	this.shadowNear.setValue(this.object.shadow.camera.near);
	this.shadowFar.setValue(this.object.shadow.camera.far);
	this.shadowLeft.setValue(this.object.shadow.camera.left);
	this.shadowRight.setValue(this.object.shadow.camera.right);
	this.shadowTop.setValue(this.object.shadow.camera.top);
	this.shadowBottom.setValue(this.object.shadow.camera.bottom);
};

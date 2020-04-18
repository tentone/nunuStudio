"use strict";

/** 
 * Shadow map configuration form for light objects that emitt shadows.
 *
 * @class LightShadowFormSnipplet
 * @extends {FormSnipplet}
 */
function LightShadowFormSnipplet(form, object)
{
	FormSnipplet.call(this, form, object);

	var self = this;
	
	// Resolution
	this.form.addText(Locale.resolution);
	this.width = new DropdownList(this.form);
	this.width.size.set(60, 18);
	this.width.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.shadow.mapSize, "width", self.width.getValue()));
		self.object.updateShadowMap();
	});
	this.form.add(this.width);
	this.form.addText("x", true);
	this.height = new DropdownList(this.form);
	this.height.size.set(60, 18);
	this.height.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.shadow.mapSize, "height", self.height.getValue()));
		self.object.updateShadowMap();
	});
	this.form.add(this.height);
	this.form.nextRow();

	for(var i = 5; i < 14; i++)
	{
		var size = Math.pow(2, i);
		this.width.addValue(size.toString(), size);
		this.height.addValue(size.toString(), size);
	}

	// Bias
	this.form.addText(Locale.bias).setAltText(Locale.hintShadowBias);
	this.bias = new NumberBox(this.form);
	this.bias.size.set(60, 18);
	this.bias.setStep(0.0001);
	this.bias.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.shadow, "bias", self.bias.getValue()));
		self.object.updateShadowMap();
	});
	this.form.add(this.bias);
	this.form.nextRow();

	// Radius
	this.form.addText(Locale.radius);
	this.radius = new NumberBox(this.form);
	this.radius.size.set(60, 18);
	this.radius.setStep(0.1);
	this.radius.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.shadow, "radius", self.radius.getValue()));
		self.object.updateShadowMap();
	});
	this.form.add(this.radius);
	this.form.nextRow();


	// Camera near
	this.form.addText(Locale.near);
	this.cameraNear = new NumberBox(this.form);
	this.cameraNear.size.set(60, 18);
	this.cameraNear.setStep(0.1);
	this.cameraNear.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.shadow.camera, "near", self.shadowNear.getValue()));
		self.object.updateShadowMap();
	});
	this.form.add(this.cameraNear);
	this.form.nextRow();
	
	// Camera far
	this.form.addText(Locale.far);
	this.cameraFar = new NumberBox(this.form);
	this.cameraFar.size.set(60, 18);
	this.cameraFar.setStep(0.1);
	this.cameraFar.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.shadow.camera, "far", self.shadowFar.getValue()));
		self.object.updateShadowMap();
	});
	this.form.add(this.cameraFar);
	this.form.nextRow();

	// Camera left
	this.form.addText(Locale.left);
	this.cameraLeft = new NumberBox(this.form);
	this.cameraLeft.size.set(60, 18);
	this.cameraLeft.setStep(0.1);
	this.cameraLeft.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.shadow.camera, "left", self.shadowLeft.getValue()));
		self.object.updateShadowMap();
	});
	this.form.add(this.cameraLeft);
	this.form.nextRow();

	// Camera right
	this.form.addText(Locale.right);
	this.cameraRight = new NumberBox(this.form);
	this.cameraRight.size.set(60, 18);
	this.cameraRight.setStep(0.1);
	this.cameraRight.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.shadow.camera, "right", self.shadowRight.getValue()));
		self.object.updateShadowMap();
	});
	this.form.add(this.cameraRight);
	this.form.nextRow();

	// Camera top
	this.form.addText(Locale.top);
	this.cameraTop = new NumberBox(this.form);
	this.cameraTop.size.set(60, 18);
	this.cameraTop.setStep(0.1);
	this.cameraTop.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.shadow.camera, "top", self.shadowTop.getValue()));
		self.object.updateShadowMap();
	});
	this.form.add(this.cameraTop);
	this.form.nextRow();

	// Camera bottom
	this.form.addText(Locale.bottom);
	this.cameraBottom = new NumberBox(this.form);
	this.cameraBottom.size.set(60, 18);
	this.cameraBottom.setStep(0.1);
	this.cameraBottom.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.shadow.camera, "bottom", self.shadowBottom.getValue()));
		self.object.updateShadowMap();
	});
	this.form.add(this.cameraBottom);
	this.form.nextRow();
}

LightShadowFormSnipplet.prototype = Object.create(FormSnipplet.prototype);

LightShadowFormSnipplet.prototype.updateValues = function()
{
	this.bias.setValue(this.object.shadow.bias);
	this.radius.setValue(this.object.shadow.radius);
	this.width.setValue(this.object.shadow.mapSize.width);
	this.height.setValue(this.object.shadow.mapSize.height);
	this.cameraNear.setValue(this.object.shadow.camera.near);
	this.cameraFar.setValue(this.object.shadow.camera.far);
	this.cameraLeft.setValue(this.object.shadow.camera.left);
	this.cameraRight.setValue(this.object.shadow.camera.right);
	this.cameraTop.setValue(this.object.shadow.camera.top);
	this.cameraBottom.setValue(this.object.shadow.camera.bottom);
};

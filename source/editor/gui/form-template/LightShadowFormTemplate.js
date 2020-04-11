"use strict";

/** 
 * Shadow map configuration form for light objects that emitt shadows.
 *
 * @class LightShadowFormTemplate
 * @extends {FormTemplate}
 */
function LightShadowFormTemplate(form, object)
{
	FormTemplate.call(this, form, object);

	var self = this;
	
	// Resolution
	this.form.addText(Locale.resolution);
	this.width = new DropdownList(this.form);
	this.width.size.set(60, 18);
	this.width.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.mapSize, "width", self.width.getValue()));
		self.object.updateShadowMap();
	});
	this.form.add(this.width);
	this.form.addText("x", true);
	this.height = new DropdownList(this.form);
	this.height.size.set(60, 18);
	this.height.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.mapSize, "height", self.height.getValue()));
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
	this.form.addText(Locale.bias);
	this.bias = new NumberBox(this.form);
	this.bias.size.set(60, 18);
	this.bias.setStep(0.0001);
	this.bias.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "bias", self.bias.getValue()));
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
		Editor.addAction(new ChangeAction(self.object, "radius", self.radius.getValue()));
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
		Editor.addAction(new ChangeAction(self.object.camera, "near", self.shadowNear.getValue()));
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
		Editor.addAction(new ChangeAction(self.object.camera, "far", self.shadowFar.getValue()));
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
		Editor.addAction(new ChangeAction(self.object.camera, "left", self.shadowLeft.getValue()));
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
		Editor.addAction(new ChangeAction(self.object.camera, "right", self.shadowRight.getValue()));
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
		Editor.addAction(new ChangeAction(self.object.camera, "top", self.shadowTop.getValue()));
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
		Editor.addAction(new ChangeAction(self.object.camera, "bottom", self.shadowBottom.getValue()));
		self.object.updateShadowMap();
	});
	this.form.add(this.cameraBottom);
	this.form.nextRow();
}

LightShadowFormTemplate.prototype = Object.create(FormTemplate.prototype);

LightShadowFormTemplate.prototype.updateValues = function()
{
	this.bias.setValue(this.object.bias);
	this.radius.setValue(this.object.radius);
	this.width.setValue(this.object.mapSize.width);
	this.height.setValue(this.object.mapSize.height);
	this.cameraNear.setValue(this.object.camera.near);
	this.cameraFar.setValue(this.object.camera.far);
	this.cameraLeft.setValue(this.object.camera.left);
	this.cameraRight.setValue(this.object.camera.right);
	this.cameraTop.setValue(this.object.camera.top);
	this.cameraBottom.setValue(this.object.camera.bottom);
};

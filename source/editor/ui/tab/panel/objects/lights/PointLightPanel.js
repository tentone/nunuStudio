"use strict";

function PointLightPanel(parent, obj)
{
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;

	//Color
	this.form.addText("Color");
	this.color = new ColorChooser(this.form.element);
	this.color.size.set(80, 18);
	this.color.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "color", new THREE.Color(self.color.getValueHex())));
	});
	this.form.add(this.color);
	this.form.nextRow();

	//Distance
	this.form.addText("Distance");
	this.distance = new NumberBox(this.form.element);
	this.distance.size.set(60, 18);
	this.distance.setStep(0.1);
	this.distance.setRange(0, Number.MAX_SAFE_INTEGER);
	this.distance.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "distance", self.distance.getValue()));
	});
	this.form.add(this.distance);
	this.form.nextRow();

	//Intensity
	this.form.addText("Intensity");
	this.intensity = new Slider(this.form.element);
	this.intensity.size.set(160, 18);
	this.intensity.setStep(0.1);
	this.intensity.setRange(0, 10);
	this.intensity.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "intensity", self.intensity.getValue()));
	});
	this.form.add(this.intensity);
	this.form.nextRow();

	//Shadow map
	this.form.addText("Shadows");
	this.form.nextRow();

	//Cast shadow
	this.castShadow = new CheckBox(this.form.element);
	this.form.addText("Cast Shadows");
	this.castShadow.size.set(15, 15);
	this.castShadow.position.set(5, 85);
	this.castShadow.updateInterface();
	this.castShadow.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "castShadow", self.castShadow.getValue()));
	});
	this.form.add(this.castShadow);
	this.form.nextRow();

	//Shadow resolution
	this.form.addText("Resolution");
	this.shadowWidth = new DropdownList(this.form.element);
	this.shadowWidth.size.set(60, 18);
	this.shadowWidth.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj.shadow.mapSize, "width", self.shadowWidth.getValue()));
		self.obj.updateShadowMap();
	});
	this.form.add(this.shadowWidth);
	this.form.addText("x", true);
	this.shadowHeight = new DropdownList(this.form.element);
	this.shadowHeight.size.set(60, 18);
	this.shadowHeight.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj.shadow.mapSize, "height", self.shadowHeight.getValue()));
		self.obj.updateShadowMap();
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
	this.shadowNear = new NumberBox(this.form.element);
	this.shadowNear.size.set(60, 18);
	this.shadowNear.setStep(0.1);
	this.shadowNear.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj.shadow.camera, "near", self.shadowNear.getValue()));
		self.obj.updateShadowMap();
	});
	this.form.add(this.shadowNear);
	this.form.nextRow();
	
	//Shadowmap camera far
	this.form.addText("Far");
	this.shadowFar = new NumberBox(this.form.element);
	this.shadowFar.size.set(60, 18);
	this.shadowFar.setStep(0.1);
	this.shadowFar.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj.shadow.camera, "far", self.shadowFar.getValue()));
		self.obj.updateShadowMap();
	});
	this.form.add(this.shadowFar);
	this.form.nextRow();

}

PointLightPanel.prototype = Object.create(Panel.prototype);

PointLightPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);
	
	this.color.setValue(this.obj.color.r, this.obj.color.g, this.obj.color.b);
	this.distance.setValue(this.obj.distance);
	this.intensity.setValue(this.obj.intensity);

	this.castShadow.setValue(this.obj.castShadow);
	this.shadowWidth.setValue(this.obj.shadow.mapSize.width);
	this.shadowHeight.setValue(this.obj.shadow.mapSize.height);
	this.shadowNear.setValue(this.obj.shadow.camera.near);
	this.shadowFar.setValue(this.obj.shadow.camera.far);
};

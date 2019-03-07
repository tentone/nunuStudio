"use strict";

function PointLightPanel(parent, object)
{
	ObjectPanel.call(this, parent, object);

	var self = this;

	//Color
	this.form.addText(Locale.color);
	this.color = new ColorChooser(this.form);
	this.color.size.set(80, 18);
	this.color.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "color", new THREE.Color(self.color.getValueHex())));
	});
	this.form.add(this.color);
	this.form.nextRow();

	//Distance
	this.form.addText("Distance");
	this.distance = new NumberBox(this.form);
	this.distance.size.set(60, 18);
	this.distance.setStep(0.1);
	this.distance.setRange(0, Number.MAX_SAFE_INTEGER);
	this.distance.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "distance", self.distance.getValue()));
	});
	this.form.add(this.distance);
	this.form.nextRow();

	//Intensity
	this.form.addText(Locale.intensity);
	this.intensity = new Slider(this.form);
	this.intensity.size.set(160, 18);
	this.intensity.setStep(0.1);
	this.intensity.setRange(0, 10);
	this.intensity.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "intensity", self.intensity.getValue()));
	});
	this.form.add(this.intensity);
	this.form.nextRow();

	//Shadow map
	this.form.addText(Locale.shadows);
	this.form.nextRow();

	//Cast shadow
	this.castShadow = new CheckBox(this.form);
	this.form.addText(Locale.castShadows);
	this.castShadow.size.set(18, 18);
	this.castShadow.position.set(5, 85);
	this.castShadow.updateInterface();
	this.castShadow.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "castShadow", self.castShadow.getValue()));
	});
	this.form.add(this.castShadow);
	this.form.nextRow();

	//Shadow resolution
	this.form.addText(Locale.resolution);
	this.shadowWidth = new DropdownList(this.form);
	this.shadowWidth.size.set(60, 18);
	this.shadowWidth.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.shadow.mapSize, "width", self.shadowWidth.getValue()));
		self.object.updateShadowMap();
	});
	this.form.add(this.shadowWidth);
	this.form.addText("x", true);
	this.shadowHeight = new DropdownList(this.form);
	this.shadowHeight.size.set(60, 18);
	this.shadowHeight.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.shadow.mapSize, "height", self.shadowHeight.getValue()));
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
	this.form.addText(Locale.near);
	this.shadowNear = new NumberBox(this.form);
	this.shadowNear.size.set(60, 18);
	this.shadowNear.setStep(0.1);
	this.shadowNear.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.shadow.camera, "near", self.shadowNear.getValue()));
		self.object.updateShadowMap();
	});
	this.form.add(this.shadowNear);
	this.form.nextRow();
	
	//Shadowmap camera far
	this.form.addText(Locale.near);
	this.shadowFar = new NumberBox(this.form);
	this.shadowFar.size.set(60, 18);
	this.shadowFar.setStep(0.1);
	this.shadowFar.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object.shadow.camera, "far", self.shadowFar.getValue()));
		self.object.updateShadowMap();
	});
	this.form.add(this.shadowFar);
	this.form.nextRow();

}

PointLightPanel.prototype = Object.create(ObjectPanel.prototype);

PointLightPanel.prototype.updatePanel = function()
{
	ObjectPanel.prototype.updatePanel.call(this);
	
	this.color.setValue(this.object.color.r, this.object.color.g, this.object.color.b);
	this.distance.setValue(this.object.distance);
	this.intensity.setValue(this.object.intensity);

	this.castShadow.setValue(this.object.castShadow);
	this.shadowWidth.setValue(this.object.shadow.mapSize.width);
	this.shadowHeight.setValue(this.object.shadow.mapSize.height);
	this.shadowNear.setValue(this.object.shadow.camera.near);
	this.shadowFar.setValue(this.object.shadow.camera.far);
};

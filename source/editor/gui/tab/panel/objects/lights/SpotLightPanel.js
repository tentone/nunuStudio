"use strict";

function SpotLightPanel(parent, object)
{
	ObjectPanel.call(this, parent, object);

	var self = this;

	//Color
	this.form.addText("Color");
	this.color = new ColorChooser(this.form);
	this.color.size.set(80, 18);
	this.color.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "color", new THREE.Color(self.color.getValueHex())));
	});
	this.form.add(this.color);
	this.form.nextRow();

	//Penumbra
	this.form.addText("Penumbra");
	this.penumbra = new Slider(this.form);
	this.penumbra.size.set(160, 18);
	this.penumbra.position.set(65, 110);
	this.penumbra.setRange(0, 1);
	this.penumbra.setStep(0.01);
	this.penumbra.updateInterface();
	this.penumbra.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "penumbra", self.penumbra.getValue()));
	});
	this.form.add(this.penumbra);
	this.form.nextRow();

	//Angle
	this.form.addText("Angle");
	this.angle = new Slider(this.form);
	this.angle.size.set(160, 18);
	this.angle.setRange(0, 1.57);
	this.angle.setStep(0.01);
	this.angle.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.object, "angle", self.angle.getValue()));
	});
	this.form.add(this.angle);
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
		Editor.addAction(new ChangeAction(self.object, "castShadow", self.castShadow.getValue()));
	});
	this.form.add(this.castShadow);
	this.form.nextRow();

	//Shadow resolution
	this.form.addText("Resolution");
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
	this.form.addText("Near");
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
	this.form.addText("Far");
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

SpotLightPanel.prototype = Object.create(ObjectPanel.prototype);

SpotLightPanel.prototype.updatePanel = function()
{
	ObjectPanel.prototype.updatePanel.call(this);

	this.color.setValue(this.object.color.r, this.object.color.g, this.object.color.b);
	this.angle.setValue(this.object.angle);
	this.penumbra.setValue(this.object.penumbra);
	
	this.castShadow.setValue(this.object.castShadow);
	this.shadowWidth.setValue(this.object.shadow.mapSize.width);
	this.shadowHeight.setValue(this.object.shadow.mapSize.height);
	this.shadowNear.setValue(this.object.shadow.camera.near);
	this.shadowFar.setValue(this.object.shadow.camera.far);
};

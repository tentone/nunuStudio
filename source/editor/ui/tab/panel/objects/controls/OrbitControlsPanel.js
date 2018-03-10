"use strict";

function OrbitControlsPanel(parent, obj)
{
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;

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

	this.form.addText("Max Distance");
	this.maxDistance = new NumberBox(this.form.element);
	this.maxDistance.size.set(60, 18);
	this.maxDistance.setStep(0.1);
	this.maxDistance.setRange(0, Number.MAX_SAFE_INTEGER);
	this.maxDistance.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "maxDistance", self.maxDistance.getValue()));
	});
	this.form.add(this.maxDistance);
	this.form.nextRow();

	this.form.addText("Min Distance");
	this.minDistance = new NumberBox(this.form.element);
	this.minDistance.size.set(60, 18);
	this.minDistance.setStep(0.1);
	this.minDistance.setRange(0, Number.MAX_SAFE_INTEGER);
	this.minDistance.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "minDistance", self.minDistance.getValue()));
	});
	this.form.add(this.minDistance);
	this.form.nextRow();

	//Needs button pressed
	this.form.addText("Require button");
	this.needsButtonPressed = new CheckBox(this.form.element);
	this.needsButtonPressed.size.set(15, 15);
	this.needsButtonPressed.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "needsButtonPressed", self.needsButtonPressed.getValue()));
	});
	this.form.add(this.needsButtonPressed);
	this.form.nextRow();

	//Movement
	this.form.addText("Movement");
	this.movementEnabled = new CheckBox(this.form.element);
	this.movementEnabled.size.set(15, 15);
	this.movementEnabled.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "movementEnabled", self.movementEnabled.getValue()));
	});
	this.form.add(this.movementEnabled);
	this.form.nextRow();

	//Sensitivity
	this.form.addText("Sensitivity");
	this.sensitivity = new Slider(this.form.element);
	this.sensitivity.size.set(140, 18);
	this.sensitivity.setStep(0.0001);
	this.sensitivity.setRange(0, 0.05);
	this.sensitivity.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "sensitivity", self.sensitivity.getValue()));
	});
	this.form.add(this.sensitivity);
	this.form.nextRow();

	//Limit up
	this.form.addText("Limit up");
	this.limitUp = new NumberBox(this.form.element);
	this.limitUp.size.set(60, 18);
	this.limitUp.setStep(0.001);
	this.limitUp.setRange(-Math.PI, Math.PI);
	this.limitUp.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "limitUp", self.limitUp.getValue()));
	});
	this.form.add(this.limitUp);
	this.form.nextRow();

	//Limit down
	this.form.addText("Limit down");
	this.limitDown = new NumberBox(this.form.element);
	this.limitDown.size.set(60, 18);
	this.limitDown.setStep(0.001);
	this.limitDown.setRange(-Math.PI, Math.PI);
	this.limitDown.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "limitDown", self.limitDown.getValue()));
	});
	this.form.add(this.limitDown);
	this.form.nextRow();

	//Zoom
	this.form.addText("Zoom");
	this.zoomEnabled = new CheckBox(this.form.element);
	this.zoomEnabled.size.set(15, 15);
	this.zoomEnabled.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "zoomEnabled", self.zoomEnabled.getValue()));
	});
	this.form.add(this.zoomEnabled);
	this.form.nextRow();

	//Zoom sensitivity
	this.form.addText("Zoom speed");
	this.zoomSensitivity = new Slider(this.form.element);
	this.zoomSensitivity.size.set(140, 18);
	this.zoomSensitivity.setStep(0.0001);
	this.zoomSensitivity.setRange(0, 0.05);
	this.zoomSensitivity.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "zoomSensitivity", self.zoomSensitivity.getValue()));
	});
	this.form.add(this.zoomSensitivity);
	this.form.nextRow();

}

OrbitControlsPanel.prototype = Object.create(Panel.prototype);

OrbitControlsPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);
	
	this.distance.setValue(this.obj.distance);
	this.maxDistance.setValue(this.obj.maxDistance);
	this.minDistance.setValue(this.obj.minDistance);
	this.needsButtonPressed.setValue(this.obj.needsButtonPressed);
	this.movementEnabled.setValue(this.obj.movementEnabled);
	this.sensitivity.setValue(this.obj.sensitivity);
	this.limitUp.setValue(this.obj.limitUp);
	this.limitDown.setValue(this.obj.limitDown);
	this.zoomEnabled.setValue(this.obj.zoomEnabled);
	this.zoomSensitivity.setValue(this.obj.zoomSensitivity);
};

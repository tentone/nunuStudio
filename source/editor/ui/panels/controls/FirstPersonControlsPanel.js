"use strict";

function FirstPersonControlsPanel(parent, obj)
{
	Panel.call(this, parent, obj);

	//Self pointer
	var self = this;

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

	//Move speed
	this.form.addText("Move speed");
	this.moveSpeed = new Slider(this.form.element);
	this.moveSpeed.size.set(140, 18);
	this.moveSpeed.setStep(0.01);
	this.moveSpeed.setRange(0, 0.5);
	this.moveSpeed.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "moveSpeed", self.moveSpeed.getValue()));
	});
	this.form.add(this.moveSpeed);
	this.form.nextRow();

	//Move on plane
	this.form.addText("Move plane");
	this.moveOnPlane = new CheckBox(this.form.element);
	this.moveOnPlane.size.set(15, 15);
	this.moveOnPlane.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.obj, "moveOnPlane", self.moveOnPlane.getValue()));
	});
	this.form.add(this.moveOnPlane);
	this.form.nextRow();
}

FirstPersonControlsPanel.prototype = Object.create(Panel.prototype);

FirstPersonControlsPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);
	
	this.needsButtonPressed.setValue(this.obj.needsButtonPressed);
	this.movementEnabled.setValue(this.obj.movementEnabled);
	this.sensitivity.setValue(this.obj.sensitivity);
	this.moveSpeed.setValue(this.obj.moveSpeed);
	this.moveOnPlane.setValue(this.obj.moveOnPlane);
};

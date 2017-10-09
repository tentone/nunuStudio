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
		if(self.obj !== null)
		{
			self.obj.needsButtonPressed = self.needsButtonPressed.getValue();
		}
	});
	this.form.add(this.needsButtonPressed);
	this.form.nextRow();
	
	//Sensitivity
	this.form.addText("Sensitivity");
	this.sensitivity = new Slider(this.form.element);
	this.sensitivity.size.set(140, 18);
	this.sensitivity.setStep(0.001);
	this.sensitivity.setRange(0, 0.1);
	this.sensitivity.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.sensitivity = self.sensitivity.getValue();
		}
	});
	this.form.add(this.sensitivity);
	this.form.nextRow();

	//Movement
	this.form.addText("Movement");
	this.movementEnabled = new CheckBox(this.form.element);
	this.movementEnabled.size.set(15, 15);
	this.movementEnabled.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.movementEnabled = self.movementEnabled.getValue();
		}
	});
	this.form.add(this.movementEnabled);
	this.form.nextRow();

	//Move speed
	this.form.addText("Move speed");
	this.moveSpeed = new Slider(this.form.element);
	this.moveSpeed.size.set(140, 18);
	this.moveSpeed.setStep(0.01);
	this.moveSpeed.setRange(0, 2);
	this.moveSpeed.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.moveSpeed = self.moveSpeed.getValue();
		}
	});
	this.form.add(this.moveSpeed);
	this.form.nextRow();

	//Move on plane
	this.form.addText("Move plane");
	this.moveOnPlane = new CheckBox(this.form.element);
	this.moveOnPlane.size.set(15, 15);
	this.moveOnPlane.setOnChange(function()
	{
		if(self.obj !== null)
		{
			self.obj.moveOnPlane = self.moveOnPlane.getValue();
		}
	});
	this.form.add(this.moveOnPlane);
	this.form.nextRow();

	//TODO <ADD moveKeys>

	//Update form
	this.form.updateInterface();
}

FirstPersonControlsPanel.prototype = Object.create(Panel.prototype);

FirstPersonControlsPanel.prototype.updatePanel = function()
{
	Panel.prototype.updatePanel.call(this);
	
	if(this.obj !== null)
	{
		this.needsButtonPressed.setValue(this.obj.needsButtonPressed);
		this.movementEnabled.setValue(this.obj.movementEnabled);
		this.sensitivity.setValue(this.obj.sensitivity);
		this.moveSpeed.setValue(this.obj.moveSpeed);
		this.moveOnPlane.setValue(this.obj.moveOnPlane);
	}
};

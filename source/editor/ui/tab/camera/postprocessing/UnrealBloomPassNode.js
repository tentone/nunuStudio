"use strict";

function UnrealBloomPassNode(parent)
{
	Form.call(this, parent);

	this.element.style.overflow = "auto";
	this.defaultTextWidth = 60;
	this.position.set(10, 5);
	this.spacing.set(5, 5);

	//Pass
	this.pass = null;

	//Render pass
	this.addText("Unreal Bloom pass");
	this.nextRow();

	var self = this;

	//Checkbox
	this.addText("Enabled");
	this.enabled = new CheckBox(this.element);
	this.enabled.size.set(15, 15);
	this.enabled.setOnChange(function()
	{
		self.pass.enabled = self.enabled.getValue();
	});
	this.add(this.enabled);
	this.nextRow();

	this.addText("Strength");
	this.strength = new NumberBox(this.element);
	this.strength.size.set(60, 18);
	this.strength.setOnChange(function()
	{
		self.pass.strength = self.strength.getValue();
	});
	this.add(this.strength);
	this.nextRow();

	this.addText("Radius");
	this.radius = new NumberBox(this.element);
	this.radius.size.set(60, 18);
	this.radius.setOnChange(function()
	{
		self.pass.radius = self.radius.getValue();
	});
	this.add(this.radius);
	this.nextRow();

	this.addText("Threshold");
	this.threshold = new NumberBox(this.element);
	this.threshold.size.set(60, 18);
	this.threshold.setOnChange(function()
	{
		self.pass.threshold = self.threshold.getValue();
	});
	this.add(this.threshold);
	this.nextRow();

	this.addText("Smooth");
	this.smooth = new NumberBox(this.element);
	this.smooth.size.set(60, 18);
	this.smooth.setOnChange(function()
	{
		self.pass.smooth = self.smooth.getValue();
	});
	this.add(this.smooth);
	this.nextRow();

	//Up
	this.up = new Button(this.element);
	this.up.size.set(50, 18);
	this.up.setText("Up");
	this.add(this.up);

	//Down
	this.up = new Button(this.element);
	this.up.size.set(50, 18);
	this.up.setText("Down");
	this.add(this.up);

	//Delete
	this.up = new Button(this.element);
	this.up.size.set(70, 18);
	this.up.setText("Delete");
	this.add(this.up);
	this.nextRow();

	this.updateInterface();
}

UnrealBloomPassNode.prototype = Object.create(Form.prototype);

UnrealBloomPassNode.prototype.setPass = function(pass)
{
	this.pass = pass;

	this.enabled.setValue(pass.enabled);
	this.strength.setValue(pass.strength);
	this.radius.setValue(pass.radius);
	this.threshold.setValue(pass.threshold);
	this.smooth.setValue(pass.smooth);
};
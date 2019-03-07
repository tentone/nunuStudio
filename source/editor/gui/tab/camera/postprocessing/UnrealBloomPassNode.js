"use strict";

function UnrealBloomPassNode(parent)
{
	PassNode.call(this, parent, "Unreal Bloom");

	var self = this;

	this.addText("Strength");
	this.strength = new NumberBox(this);
	this.strength.size.set(60, 18);
	this.strength.setOnChange(function()
	{
		self.pass.strength = self.strength.getValue();
	});
	this.add(this.strength);
	this.nextRow();

	this.addText("Radius");
	this.radius = new NumberBox(this);
	this.radius.size.set(60, 18);
	this.radius.setOnChange(function()
	{
		self.pass.radius = self.radius.getValue();
	});
	this.add(this.radius);
	this.nextRow();

	this.addText("Threshold");
	this.threshold = new NumberBox(this);
	this.threshold.size.set(60, 18);
	this.threshold.setOnChange(function()
	{
		self.pass.threshold = self.threshold.getValue();
	});
	this.add(this.threshold);
	this.nextRow();

	this.addText(Locale.smooth);
	this.smooth = new NumberBox(this);
	this.smooth.size.set(60, 18);
	this.smooth.setOnChange(function()
	{
		self.pass.smooth = self.smooth.getValue();
	});
	this.add(this.smooth);
	this.nextRow();
}

UnrealBloomPassNode.prototype = Object.create(PassNode.prototype);

PassNode.registerPass("UnrealBloom", UnrealBloomPassNode);

UnrealBloomPassNode.prototype.setPass = function(pass)
{
	PassNode.prototype.setPass.call(this, pass);

	this.strength.setValue(pass.strength);
	this.radius.setValue(pass.radius);
	this.threshold.setValue(pass.threshold);
	this.smooth.setValue(pass.smooth);
};
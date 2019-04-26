"use strict";

function SSAONOHPassNode(parent)
{
	PassNode.call(this, parent, "SSAO NOH");

	var self = this;

	this.addText("Kernel Radius");
	this.kernelRadius = new NumberBox(this);
	this.kernelRadius.size.set(0, 18);
	this.kernelRadius.setStep(1.0);
	this.kernelRadius.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "kernelRadius", self.kernelRadius.getValue()));
	});
	this.add(this.kernelRadius);
	this.nextRow();

	this.addText("Kernel Size");
	this.kernelSize = new NumberBox(this);
	this.kernelSize.size.set(0, 18);
	this.kernelSize.setStep(1.0);
	this.kernelSize.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "kernelSize", self.kernelSize.getValue()));
	});
	this.add(this.kernelSize);
	this.nextRow();

	this.addText("Min Distance");
	this.minDistance = new NumberBox(this);
	this.minDistance.size.set(0, 18);
	this.minDistance.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "minDistance", self.minDistance.getValue()));
	});
	this.add(this.minDistance);
	this.nextRow();

	this.addText("Max Distance");
	this.maxDistance = new NumberBox(this);
	this.maxDistance.size.set(0, 18);
	this.maxDistance.setOnChange(function()
	{
		Editor.addAction(new ChangeAction(self.pass, "maxDistance", self.maxDistance.getValue()));
	});
	this.add(this.maxDistance);
	this.nextRow();
}

SSAONOHPassNode.prototype = Object.create(PassNode.prototype);

PassNode.registerPass("SSAONOH", SSAONOHPassNode);

SSAONOHPassNode.prototype.setPass = function(pass)
{
	PassNode.prototype.setPass.call(this, pass);

	this.kernelRadius.setValue(pass.kernelRadius);
	this.minDistance.setValue(pass.minDistance);
	this.maxDistance.setValue(pass.maxDistance);
	this.kernelSize.setValue(pass.kernelSize);
};
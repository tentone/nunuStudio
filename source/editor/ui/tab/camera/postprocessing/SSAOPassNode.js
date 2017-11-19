"use strict";

function SSAOPassNode(parent)
{
	PassNode.call(this, parent, "SSAO");

	var self = this;

	this.addText("Only AO");
	this.onlyAO = new CheckBox(this.element);
	this.onlyAO.size.set(15, 15);
	this.onlyAO.setOnChange(function()
	{
		self.pass.onlyAO = self.onlyAO.getValue();
	});
	this.add(this.onlyAO);
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

	this.addText("Clamp");
	this.aoClamp = new NumberBox(this.element);
	this.aoClamp.size.set(60, 18);
	this.aoClamp.setOnChange(function()
	{
		self.pass.aoClamp = self.aoClamp.getValue();
	});
	this.add(this.aoClamp);
	this.nextRow();

	this.addText("Lum. Influence");
	this.lumInfluence = new NumberBox(this.element);
	this.lumInfluence.size.set(60, 18);
	this.lumInfluence.setOnChange(function()
	{
		self.pass.lumInfluence = self.lumInfluence.getValue();
	});
	this.add(this.lumInfluence);
	this.nextRow();
}

SSAOPassNode.prototype = Object.create(PassNode.prototype);

SSAOPassNode.prototype.setPass = function(pass)
{
	PassNode.prototype.setPass.call(this, pass);

	this.radius.setValue(pass.radius);
	this.onlyAO.setValue(pass.onlyAO);
	this.aoClamp.setValue(pass.aoClamp);
	this.lumInfluence.setValue(pass.lumInfluence);
};
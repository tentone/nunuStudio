"use strict";

function BokehPassNode(parent)
{
	PassNode.call(this, parent, "Bokeh");

	var self = this;

	this.addText("Aperture");
	this.aperture = new NumberBox(this.element);
	this.aperture.size.set(60, 18);
	this.aperture.setOnChange(function()
	{
		self.pass.aperture = self.aperture.getValue();
	});
	this.add(this.aperture);
	this.nextRow();

	this.addText("Focus");
	this.focus = new NumberBox(this.element);
	this.focus.size.set(60, 18);
	this.focus.setOnChange(function()
	{
		self.pass.focus = self.focus.getValue();
	});
	this.add(this.focus);
	this.nextRow();

	this.addText("Max Blur");
	this.maxblur = new NumberBox(this.element);
	this.maxblur.size.set(60, 18);
	this.maxblur.setOnChange(function()
	{
		self.pass.maxblur = self.maxblur.getValue();
	});
	this.add(this.maxblur);
	this.nextRow();
}

BokehPassNode.prototype = Object.create(PassNode.prototype);

BokehPassNode.prototype.setPass = function(pass)
{
	PassNode.prototype.setPass.call(this, pass);

	this.aperture.setValue(pass.aperture);
	this.focus.setValue(pass.focus);
	this.maxblur.setValue(pass.maxblur);
};
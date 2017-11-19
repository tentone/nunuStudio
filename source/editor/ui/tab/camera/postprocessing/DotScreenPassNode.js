"use strict";

function DotScreenPassNode(parent)
{
	PassNode.call(this, parent, "Dot Screen");

	var self = this;

	this.addText("Angle");
	this.angle = new NumberBox(this.element);
	this.angle.size.set(60, 18);
	this.angle.setOnChange(function()
	{
		self.pass.angle = self.angle.getValue();
	});
	this.add(this.angle);
	this.nextRow();

	this.addText("Scale");
	this.scale = new NumberBox(this.element);
	this.scale.size.set(60, 18);
	this.scale.setOnChange(function()
	{
		self.pass.scale = self.scale.getValue();
	});
	this.add(this.scale);
	this.nextRow();

	this.addText("Center");
	this.center = new CoordinatesBox(this.element);
	this.center.setMode(CoordinatesBox.VECTOR2);
	this.center.size.set(120, 18);
	this.center.setStep(0.01);
	this.center.setOnChange(function()
	{
		var value = self.center.getValue();
		self.pass.center.set(value.x, value.y);
	});
	this.add(this.center);
	this.nextRow();

}

DotScreenPassNode.prototype = Object.create(PassNode.prototype);

DotScreenPassNode.prototype.setPass = function(pass)
{
	PassNode.prototype.setPass.call(this, pass);

	this.angle.setValue(pass.angle);
	this.scale.setValue(pass.scale);
	this.center.setValue(pass.center);
};
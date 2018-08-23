"use strict";

function ColorifyPassNode(parent)
{
	PassNode.call(this, parent, "Colorify");

	var self = this;

	this.addText("Color");
	this.color = new ColorChooser(this);
	this.color.size.set(80, 18);
	this.color.setOnChange(function()
	{
		var color = self.color.getValue();
		self.pass.color.setRGB(color.r, color.g, color.b);
	});
	this.add(this.color);
	this.nextRow();
}

ColorifyPassNode.prototype = Object.create(PassNode.prototype);

PassNode.registerPass("Colorify", ColorifyPassNode);

ColorifyPassNode.prototype.setPass = function(pass)
{
	PassNode.prototype.setPass.call(this, pass);

	this.color.setValue(this.pass.color.r, this.pass.color.g, this.pass.color.b);
};
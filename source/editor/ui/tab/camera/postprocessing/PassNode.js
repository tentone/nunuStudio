"use strict";

function PassNode(parent)
{
	Form.call(this, parent);

	this.element.style.overflow = "auto";
	this.defaultTextWidth = 60;
	this.position.set(10, 5);
	this.spacing.set(5, 5);

	//Pass
	this.pass = null;

	//Render pass
	this.addText("Render pass");
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

PassNode.prototype = Object.create(Form.prototype);

PassNode.prototype.setPass = function(pass)
{
	this.pass = pass;

	this.enabled.setValue(pass.enabled);
};